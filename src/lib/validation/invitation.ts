import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.email("E-mail inválido."),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const acceptInvitationSchema = z.object({
  name: z.string().min(2, "Nome muito curto."),
  password: z.string().min(8, "Senha precisa ter pelo menos 8 caracteres."),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
