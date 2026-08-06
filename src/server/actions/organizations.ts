"use server";

import { redirect } from "next/navigation";
import { auth, unstable_update } from "@/auth";
import { prisma } from "@/server/db";

export async function switchOrganizationAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado.");
  }

  const organizationId = formData.get("organizationId");
  if (typeof organizationId !== "string" || !organizationId) {
    throw new Error("Organização inválida.");
  }

  // A única fonte de verdade de "o usuário pode estar nessa organização" é
  // ter uma Membership pra ela — nunca aceitar organizationId do cliente
  // sem essa checagem (mesma regra dura do resto do app).
  const membership = await prisma.membership.findUnique({
    where: { organizationId_userId: { organizationId, userId: session.user.id } },
  });
  if (!membership) {
    throw new Error("Você não é membro dessa organização.");
  }

  await unstable_update({ user: { organizationId: membership.organizationId, role: membership.role } });
  redirect("/dashboard");
}
