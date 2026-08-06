"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createPipeline, createStage } from "@/server/repositories/pipelines";
import { pipelineSchema, pipelineStageSchema } from "@/lib/validation/pipeline";

export async function createPipelineAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Não autenticado.");
  }

  const parsed = pipelineSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  await createPipeline(session.user.organizationId, parsed.data);
  revalidatePath("/pipelines");
}

export async function createStageAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Não autenticado.");
  }

  const pipelineId = formData.get("pipelineId");
  if (typeof pipelineId !== "string" || !pipelineId) {
    throw new Error("Pipeline inválido.");
  }

  const parsed = pipelineStageSchema.safeParse({
    name: formData.get("name"),
    order: formData.get("order"),
    probability: formData.get("probability"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  await createStage(session.user.organizationId, pipelineId, parsed.data);
  revalidatePath("/pipelines");
}
