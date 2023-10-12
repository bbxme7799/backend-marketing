import * as z from "zod";

export const OrderIdSchema = z.object({
  orderId: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive()
  ),
});
export const BuyNowSchema = z.object({
  quantity: z.number().int().min(0),
  url: z.string().url(),
});
