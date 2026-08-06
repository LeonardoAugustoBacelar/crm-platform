import { prisma } from "@/server/db";

export function getOrganizationName(organizationId: string) {
  return prisma.organization.findUniqueOrThrow({
    where: { id: organizationId },
    select: { name: true },
  });
}

export async function getOrganizationSummary(organizationId: string) {
  // Sequencial em vez de Promise.all: alguns Postgres locais/gerenciados
  // (ex: `npx prisma dev`, poolers em modo transaction) não seguram bem
  // várias queries concorrentes na mesma conexão.
  const organization = await prisma.organization.findUniqueOrThrow({ where: { id: organizationId } });
  const companyCount = await prisma.company.count({ where: { organizationId } });
  const contactCount = await prisma.contact.count({ where: { organizationId } });
  const openOpportunityCount = await prisma.opportunity.count({ where: { organizationId, status: "OPEN" } });

  return { organization, companyCount, contactCount, openOpportunityCount };
}
