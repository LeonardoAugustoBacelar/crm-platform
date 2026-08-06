import { z } from "zod";

export const pipelineSchema = z.object({
  name: z.string().min(2, "Nome muito curto."),
});

export type PipelineInput = z.infer<typeof pipelineSchema>;

export const pipelineStageSchema = z.object({
  name: z.string().min(2, "Nome muito curto."),
  order: z.coerce.number().int("Ordem deve ser um número inteiro.").min(0, "Ordem não pode ser negativa."),
  probability: z.coerce
    .number()
    .int("Probabilidade deve ser um número inteiro.")
    .min(0, "Probabilidade mínima é 0.")
    .max(100, "Probabilidade máxima é 100."),
});

export type PipelineStageInput = z.infer<typeof pipelineStageSchema>;
