import { Resend } from "resend";

/**
 * Sem RESEND_API_KEY configurada, o envio é pulado silenciosamente — o
 * convite continua funcionando normalmente, só que só via o link copiável
 * em /settings (ver src/app/(app)/settings/page.tsx). Mesmo padrão de
 * fallback gracioso do login social (ver src/auth.ts).
 */
export async function sendInvitationEmail(params: {
  to: string;
  organizationName: string;
  inviteUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: params.to,
    subject: `Você foi convidado para ${params.organizationName} no CRM Platform`,
    html: `
      <p>Você foi convidado para entrar em <strong>${params.organizationName}</strong> no CRM Platform.</p>
      <p><a href="${params.inviteUrl}">Aceitar convite</a></p>
      <p style="color:#666;font-size:12px">Se você não esperava este convite, pode ignorar este e-mail.</p>
    `,
  });
}
