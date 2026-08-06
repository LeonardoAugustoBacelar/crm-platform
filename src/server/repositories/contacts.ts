import { prisma } from "@/server/db";
import type { ContactInput } from "@/lib/validation/contact";

/**
 * Mesma regra dura das demais entidades de negócio: organizationId é o
 * primeiro argumento obrigatório em toda função (ver nota em
 * src/server/repositories/companies.ts).
 */
export function listContacts(organizationId: string) {
  return prisma.contact.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: { company: { select: { name: true } } },
  });
}

export async function createContact(organizationId: string, data: ContactInput) {
  if (data.companyId) {
    const company = await prisma.company.findFirst({
      where: { id: data.companyId, organizationId },
      select: { id: true },
    });
    if (!company) {
      throw new Error("Empresa inválida.");
    }
  }

  return prisma.contact.create({
    data: { ...data, organizationId },
  });
}
