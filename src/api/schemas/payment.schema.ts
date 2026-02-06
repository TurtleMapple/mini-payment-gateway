import { z } from "zod"

export const CreatePaymentSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().length(3),
})

export const CreatePaymentResponseSchema = z.object({
  payment_id: z.string(),
  status: z.literal("CREATED"),
})