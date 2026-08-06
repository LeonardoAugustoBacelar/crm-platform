import { prisma } from "@/server/db";
import type { PipelineInput, PipelineStageInput } from "@/lib/validation/pipeline";

/**
 * Mesma regra dura das demais entidades de negócio: organizationId é o
 * primeiro argumento obrigatório em toda função (ver nota em
 * src/server/repositories/companies.ts).
 */
export function listPipelines(organizationId: string) {
  return prisma.pipeline.findMany({
    where: { organizationId },
    orderBy: { createdAt: "asc" },
    include: { stages: { orderBy: { order: "asc" } } },
  });
}

export function createPipeline(organizationId: string, data: PipelineInput) {
  return prisma.pipeline.create({
    data: { ...data, organizationId },
  });
}

export async function createStage(organizationId: string, pipelineId: string, data: PipelineStageInput) {
  const pipeline = await prisma.pipeline.findFirst({
    where: { id: pipelineId, organizationId },
    select: { id: true },
  });
  if (!pipeline) {
    throw new Error("Pipeline inválido.");
  }

  return prisma.pipelineStage.create({
    data: { ...data, pipelineId },
  });
}
