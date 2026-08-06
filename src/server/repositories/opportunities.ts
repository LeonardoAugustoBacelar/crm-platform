import { prisma } from "@/server/db";
import type { OpportunityInput } from "@/lib/validation/opportunity";

/**
 * Mesma regra dura das demais entidades de negócio: organizationId é o
 * primeiro argumento obrigatório em toda função (ver nota em
 * src/server/repositories/companies.ts).
 */
export function listOpportunities(organizationId: string) {
  return prisma.opportunity.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { name: true } },
      contact: { select: { name: true } },
      stage: { select: { name: true, pipeline: { select: { name: true } } } },
    },
  });
}

export async function createOpportunity(organizationId: string, data: OpportunityInput) {
  // stageId chega do cliente; resolvemos o pipelineId a partir dele (em vez
  // de confiar num pipelineId separado do form) e validamos no mesmo passo
  // que a etapa pertence à organização do usuário autenticado.
  const stage = await prisma.pipelineStage.findFirst({
    where: { id: data.stageId, pipeline: { organizationId } },
    select: { id: true, pipelineId: true },
  });
  if (!stage) {
    throw new Error("Etapa inválida.");
  }

  if (data.companyId) {
    const company = await prisma.company.findFirst({
      where: { id: data.companyId, organizationId },
      select: { id: true },
    });
    if (!company) {
      throw new Error("Empresa inválida.");
    }
  }

  if (data.contactId) {
    const contact = await prisma.contact.findFirst({
      where: { id: data.contactId, organizationId },
      select: { id: true },
    });
    if (!contact) {
      throw new Error("Contato inválido.");
    }
  }

  return prisma.opportunity.create({
    data: {
      title: data.title,
      valueCents: data.valueCents,
      expectedCloseDate: data.expectedCloseDate,
      organizationId,
      pipelineId: stage.pipelineId,
      stageId: stage.id,
      companyId: data.companyId,
      contactId: data.contactId,
    },
  });
}
