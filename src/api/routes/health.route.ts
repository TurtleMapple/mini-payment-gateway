import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi"

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  responses: {
    200: {
      description: "Health check response",
      content: {
        "application/json": {
          schema: z.object({
            status: z.literal("ok"),
            timestamp: z.string(),
            service: z.string(),
          }),
        },
      },
    },
  },
})

export const createHealthRoute = () => {
  const app = new OpenAPIHono()

  app.openapi(healthRoute, (c) => {
    return c.json({
      status: "ok" as const,
      timestamp: new Date().toISOString(),
      service: "payment-notification-api",
    })
  })

  return app
}