"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createCompany } from "@/server/repositories/companies";
import { companySchema } from "@/lib/validation/company";

export async function createCompanyAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Não autenticado.");
  }

  const parsed = companySchema.safeParse({
    name: formData.get("name"),
    domain: formData.get("domain") || undefined,
    industry: formData.get("industry") || undefined,
    size: formData.get("size") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  await createCompany(session.user.organizationId, parsed.data);
  revalidatePath("/companies");
}
