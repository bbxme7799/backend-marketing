import * as z from "zod";

export const CartSchema = z.object({
  quantity: z.number().positive(),
  url: z.string().url(),
});

export const ItemIdSchema = z.object({
  itemId: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive()
  ),
});
