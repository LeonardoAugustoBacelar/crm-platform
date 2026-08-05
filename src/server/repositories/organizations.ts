import { prisma } from "@/server/db";

export async function getOrganizationSummary(organizationId: string) {
  const [organization, companyCount, contactCount, openOpportunityCount] = await Promise.all([
    prisma.organization.findUniqueOrThrow({ where: { id: organizationId } }),
    prisma.company.count({ where: { organizationId } }),
    prisma.contact.count({ where: { organizationId } }),
    prisma.opportunity.count({ where: { organizationId, status: "OPEN" } }),
  ]);

  return { organization, companyCount, contactCount, openOpportunityCount };
}
