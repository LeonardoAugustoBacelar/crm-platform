import { prisma } from "@/server/db";
import type { CompanyInput } from "@/lib/validation/company";

/**
 * Todo repositório neste diretório recebe organizationId como primeiro
 * argumento obrigatório — nunca opcional. É a regra dura de isolamento
 * multi-tenant: nenhuma query de dados de negócio pode rodar sem estar
 * filtrada pelo tenant do usuário autenticado (ver src/auth.ts, que só
 * põe organizationId na sessão a partir da membership no banco).
 */
export function listCompanies(organizationId: string) {
  return prisma.company.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });
}

export function createCompany(organizationId: string, data: CompanyInput) {
  return prisma.company.create({
    data: { ...data, organizationId },
  });
}
