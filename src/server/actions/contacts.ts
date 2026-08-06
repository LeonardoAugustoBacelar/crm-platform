"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createContact } from "@/server/repositories/contacts";
import { contactSchema } from "@/lib/validation/contact";

export async function createContactAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    throw new Error("Não autenticado.");
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email") || undefined,
    phone: formData.get("phone") || undefined,
    jobTitle: formData.get("jobTitle") || undefined,
    companyId: formData.get("companyId") || undefined,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  await createContact(session.user.organizationId, parsed.data);
  revalidatePath("/contacts");
}
