"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createOpportunity } from "@/server/repositories/opportunities";
import { opportunitySchema } from "@/lib/validation/opportunity";

export async function createOpportunityAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Não autenticado.");
  }

  const rawValue = formData.get("value");
  const valueCents = typeof rawValue === "string" && rawValue !== "" ? Math.round(Number(rawValue) * 100) : NaN;
  if (!Number.isFinite(valueCents)) {
    throw new Error("Valor inválido.");
  }

  const parsed = opportunitySchema.safeParse({
    title: formData.get("title"),
    valueCents,
    stageId: formData.get("stageId"),
    companyId: formData.get("companyId") || undefined,
    contactId: formData.get("contactId") || undefined,
    expectedCloseDate: formData.get("expectedCloseDate") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  await createOpportunity(session.user.organizationId, parsed.data);
  revalidatePath("/opportunities");
}
