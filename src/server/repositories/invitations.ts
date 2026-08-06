import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db";
import type { InviteMemberInput } from "@/lib/validation/invitation";

const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Mesma regra dura das demais entidades de negócio: organizationId é o
 * primeiro argumento obrigatório em toda função (ver nota em
 * src/server/repositories/companies.ts).
 */
export function listPendingInvitations(organizationId: string) {
  return prisma.invitation.findMany({
    where: { organizationId, acceptedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInvitation(
  organizationId: string,
  invitedById: string,
  data: InviteMemberInput
) {
  const existingMember = await prisma.membership.findFirst({
    where: { organizationId, user: { email: data.email } },
    select: { id: true },
  });
  if (existingMember) {
    throw new Error("Esse e-mail já é membro da organização.");
  }

  // Reemitir convite: substitui qualquer convite pendente anterior pro
  // mesmo e-mail nessa organização em vez de acumular duplicado.
  await prisma.invitation.deleteMany({
    where: { organizationId, email: data.email, acceptedAt: null },
  });

  const token = crypto.randomBytes(24).toString("hex");

  return prisma.invitation.create({
    data: {
      organizationId,
      invitedById,
      email: data.email,
      role: data.role,
      token,
      expiresAt: new Date(Date.now() + INVITATION_TTL_MS),
    },
  });
}

export function getInvitationByToken(token: string) {
  return prisma.invitation.findUnique({
    where: { token },
    include: { organization: { select: { id: true, name: true } } },
  });
}

function assertInvitationUsable(invitation: { acceptedAt: Date | null; expiresAt: Date }) {
  if (invitation.acceptedAt) {
    throw new Error("Convite já foi aceito.");
  }
  if (invitation.expiresAt < new Date()) {
    throw new Error("Convite expirado.");
  }
}

/** Aceita o convite pra um usuário já logado (cujo e-mail bate com o convite). */
export async function acceptInvitationForExistingUser(token: string, userId: string) {
  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation) throw new Error("Convite não encontrado.");
  assertInvitationUsable(invitation);

  const membership = await prisma.$transaction(async (tx) => {
    const created = await tx.membership.upsert({
      where: { organizationId_userId: { organizationId: invitation.organizationId, userId } },
      create: { organizationId: invitation.organizationId, userId, role: invitation.role },
      update: {},
    });
    await tx.invitation.update({ where: { id: invitation.id }, data: { acceptedAt: new Date() } });
    return created;
  });

  return { organizationId: invitation.organizationId, role: membership.role };
}

/** Aceita o convite criando uma conta nova (usuário ainda não existia). */
export async function acceptInvitationForNewUser(
  token: string,
  data: { name: string; password: string }
) {
  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation) throw new Error("Convite não encontrado.");
  assertInvitationUsable(invitation);

  const existingUser = await prisma.user.findUnique({ where: { email: invitation.email } });
  if (existingUser) {
    throw new Error("Já existe uma conta com esse e-mail. Faça login e abra o link do convite de novo.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { name: data.name, email: invitation.email, passwordHash },
    });
    await tx.membership.create({
      data: { organizationId: invitation.organizationId, userId: created.id, role: invitation.role },
    });
    await tx.invitation.update({ where: { id: invitation.id }, data: { acceptedAt: new Date() } });
    return created;
  });

  return { userId: user.id, email: user.email, organizationId: invitation.organizationId, role: invitation.role };
}
