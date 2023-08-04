import * as z from "zod";

export const ProductFilter = z.object({
  keyword: z.string().default(""),
  category: z.string().default(""),
  page: z.preprocess(
    (a) => (a !== undefined ? parseInt(z.string().parse(a)) : 1),
    z.number().positive()
  ),
  per_page: z.preprocess(
    (a) => (a !== undefined ? parseInt(z.string().parse(a)) : 20),
    z.number().positive().max(200)
  ),
});

export const ProdIdSchema = z.object({
  prodId: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive()
  ),
});
