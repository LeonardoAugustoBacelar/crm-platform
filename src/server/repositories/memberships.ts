import { prisma } from "@/server/db";

/**
 * Membership não é dado de negócio isolado por tenant do mesmo jeito que
 * Company/Contact/etc — é o vínculo usuário<->organização em si, então as
 * duas funções abaixo consultam por um lado ou outro dessa relação (nunca
 * sem escopo nenhum).
 */
export function listMembers(organizationId: string) {
  return prisma.membership.findMany({
    where: { organizationId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });
}

export function listMembershipsForUser(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { organization: { select: { id: true, name: true } } },
  });
}
