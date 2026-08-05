"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { signIn } from "@/auth";
import { signUpSchema } from "@/lib/validation/auth";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    // \p{Mn}: marcas de acento combinantes, restam depois do NFD (ex: "ação" -> "acao").
    .replace(/\p{Mn}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    organizationName: formData.get("organizationName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(`/signup?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados inválidos.")}`);
  }

  const { organizationName, name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=E-mail já cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const baseSlug = slugify(organizationName) || "org";
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

  // Organização + usuário + membership (OWNER) nascem juntos numa
  // transação — não existe usuário "solto" sem organização no MVP.
  await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name: organizationName, slug },
    });

    const user = await tx.user.create({
      data: { name, email, passwordHash },
    });

    await tx.membership.create({
      data: { organizationId: organization.id, userId: user.id, role: "OWNER" },
    });
  });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
}
