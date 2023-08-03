import * as z from "zod";

export const CategoySchema = z.object({
  name: z.string().trim().min(1),
});

export const CategoryIdSchema = z.object({
  catId: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive()
  ),
});

export const CategoryFilter = z.object({
  keyword: z.string().default(""),
  page: z.preprocess(
    (a) => (a !== undefined ? parseInt(z.string().parse(a)) : 1),
    z.number().positive()
  ),
  per_page: z.preprocess(
    (a) => (a !== undefined ? parseInt(z.string().parse(a)) : 20),
    z.number().positive().max(200)
  ),
  
});
