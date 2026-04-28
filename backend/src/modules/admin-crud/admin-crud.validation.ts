import { z } from "zod";

export const resourceParamSchema = z.object({
  resource: z.string().min(1),
});

export const resourceIdParamSchema = z.object({
  resource: z.string().min(1),
  id: z.coerce.number().int().positive(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  keyword: z.string().trim().optional(),
});

export const createBodySchema = z.record(z.string(), z.unknown());

export const updateBodySchema = z.record(z.string(), z.unknown());

export type ResourceParam = z.infer<typeof resourceParamSchema>;
export type ResourceIdParam = z.infer<typeof resourceIdParamSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
