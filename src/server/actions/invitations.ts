"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { auth, signIn, unstable_update } from "@/auth";
import {
  acceptInvitationForExistingUser,
  acceptInvitationForNewUser,
  createInvitation,
  getInvitationByToken,
} from "@/server/repositories/invitations";
import { getOrganizationName } from "@/server/repositories/organizations";
import { acceptInvitationSchema, inviteMemberSchema } from "@/lib/validation/invitation";
import { sendInvitationEmail } from "@/lib/email";

export async function inviteMemberAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId || !session.user.id) {
    throw new Error("Não autenticado.");
  }
  if (session.user.role !== "OWNER" && session.user.role !== "ADMIN") {
    throw new Error("Só OWNER ou ADMIN podem convidar membros.");
  }

  const parsed = inviteMemberSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const invitation = await createInvitation(session.user.organizationId, session.user.id, parsed.data);

  // Falha no envio de e-mail não deve derrubar o convite em si — o link
  // continua disponível pra copiar em /settings como fallback (ver
  // src/lib/email.ts: sem RESEND_API_KEY isso é um no-op silencioso).
  try {
    const organization = await getOrganizationName(session.user.organizationId);
    const headersList = await headers();
    const host = headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
    await sendInvitationEmail({
      to: invitation.email,
      organizationName: organization.name,
      inviteUrl: `${proto}://${host}/invite/${invitation.token}`,
    });
  } catch (err) {
    console.error("Falha ao enviar e-mail de convite:", err);
  }

  revalidatePath("/settings");
}

export async function acceptInvitationAction(formData: FormData) {
  const token = formData.get("token");
  if (typeof token !== "string" || !token) {
    throw new Error("Convite inválido.");
  }

  const session = await auth();

  // Usuário já logado com o e-mail convidado: só cria a membership.
  if (session?.user?.email && session.user.id) {
    const invitation = await getInvitationByToken(token);
    if (!invitation) {
      throw new Error("Convite não encontrado.");
    }
    if (session.user.email !== invitation.email) {
      throw new Error("Esse convite é pra outro e-mail. Saia e entre com o e-mail convidado.");
    }

    const { organizationId, role } = await acceptInvitationForExistingUser(token, session.user.id);
    await unstable_update({ user: { organizationId, role } });
    redirect("/dashboard");
  }

  // Ninguém logado: cria conta nova a partir do nome/senha do formulário.
  const parsed = acceptInvitationSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos.");
  }

  const { email } = await acceptInvitationForNewUser(token, parsed.data);

  try {
    await signIn("credentials", { email, password: parsed.data.password, redirectTo: "/dashboard" });
  } catch (err) {
    // signIn() bem-sucedido lança um redirect internamente (NEXT_REDIRECT),
    // que não é um AuthError — precisa propagar, senão o redirect nunca acontece.
    if (err instanceof AuthError) {
      redirect("/login");
    }
    throw err;
  }
}
