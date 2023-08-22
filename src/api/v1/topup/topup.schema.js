import * as z from "zod";

export const TopupSchema = z.object({
  address: z.string().min(8),
});
