import { z } from "zod";

export const opportunitySchema = z.object({
  title: z.string().min(2, "Título muito curto."),
  valueCents: z.number().int("Valor inválido.").min(0, "Valor não pode ser negativo."),
  stageId: z.string().min(1, "Selecione uma etapa."),
  companyId: z.string().optional(),
  contactId: z.string().optional(),
  expectedCloseDate: z.coerce.date().optional(),
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;
