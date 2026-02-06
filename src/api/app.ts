import { OpenAPIHono } from "@hono/zod-openapi"
import { apiReference } from "@scalar/hono-api-reference"
import { CreatePaymentService } from "./services/create-payment.service"
import { paymentRoute } from "./routes/payments.route"
import { createHealthRoute } from "./routes/health.route"

export const createApp = (createPaymentService: CreatePaymentService) => {
  const app = new OpenAPIHono()

  // Health Check
  app.route("/", createHealthRoute())

  // Routes
  app.route("/", paymentRoute(createPaymentService))

  // OpenAPI JSON spec
  app.doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Payment Notification API",
      description: "API for payment notifications with RabbitMQ",
    },
  })

  // Scalar UI Documentation
  app.get(
    "/doc",
    apiReference({
      spec: {
        url: "/openapi.json",
      },
    })
  )

  // Redirect root to documentation
  app.get("/", (c) => {
    return c.redirect("/doc")
  })
  
  return app
}
