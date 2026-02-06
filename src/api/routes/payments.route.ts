import { OpenAPIHono, createRoute } from "@hono/zod-openapi"
import {
  CreatePaymentSchema,
  CreatePaymentResponseSchema,
} from "../schemas/payment.schema"
import { CreatePaymentService } from "../services/create-payment.service"

const createPaymentRoute = createRoute({
  method: "post",
  path: "/payments",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePaymentSchema,
        },
      },
    },
  },
  responses: {
    202: {
      description: "Payment created",
      content: {
        "application/json": {
          schema: CreatePaymentResponseSchema,
        },
      },
    },
  },
})

export const paymentRoute = (
  createPaymentService: CreatePaymentService
) => {
  const app = new OpenAPIHono()

  app.openapi(createPaymentRoute, async (c) => {
    const input = c.req.valid("json")
    const result = await createPaymentService.execute(input)
    return c.json(result, 202)
  })

  return app
}
