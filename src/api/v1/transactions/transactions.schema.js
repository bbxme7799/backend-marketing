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

export const WithdrawSchema = z.object({
  amount: z.number().int(),
  walletPublicKey: z.string().trim().min(1),
});

export const WithdrawIdSchema = z.object({
  withdrawId: z.preprocess(
    (a) => parseInt(z.string().parse(a)),
    z.number().positive()
  ),
});
