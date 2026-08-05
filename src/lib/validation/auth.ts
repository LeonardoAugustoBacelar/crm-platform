import { z } from "zod";

export const signUpSchema = z.object({
  organizationName: z.string().min(2, "Nome da organização muito curto."),
  name: z.string().min(2, "Nome muito curto."),
  email: z.email("E-mail inválido."),
  password: z.string().min(8, "Senha precisa ter pelo menos 8 caracteres."),
});
