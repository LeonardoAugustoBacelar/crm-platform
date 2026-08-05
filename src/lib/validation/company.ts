import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(2, "Nome muito curto."),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;
