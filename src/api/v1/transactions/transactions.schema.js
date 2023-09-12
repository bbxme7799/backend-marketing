import * as z from "zod";

export const TransactionsFilter = z.object({
  page: z.preprocess(
    (a) => (a !== undefined ? parseInt(z.string().parse(a)) : 1),
    z.number().positive()
  ),
  per_page: z.preprocess(
    (a) => (a !== undefined ? parseInt(z.string().parse(a)) : 20),
    z.number().positive().max(200)
  ),
});