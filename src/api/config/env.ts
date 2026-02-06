import { z } from "zod"

const baseSchema = z.object({
  // RabbitMQ
  RABBITMQ_URL: z.string().default("amqp://localhost:5672"),

  // Application
  APP_MODE: z.enum(["api", "worker"]),
  PORT: z.string().default("3000"),
})

const workerSchema = baseSchema.extend({
  APP_MODE: z.literal("worker"),
  // Database (required for worker)
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string(), // allow empty password
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("3306"),
})

const apiSchema = baseSchema.extend({
  APP_MODE: z.literal("api"),
  // Database vars intentionally optional for API mode
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.string().optional(),
})

export function validateEnv() {
  try {
    const mode = (process.env.APP_MODE || "api") as "api" | "worker"
    const env =
      mode === "worker"
        ? workerSchema.parse({ ...process.env, APP_MODE: "worker" })
        : apiSchema.parse({ ...process.env, APP_MODE: "api" })
    console.log("✅ Environment variables validated")
    return env
  } catch (error) {
    console.error("❌ Environment validation failed:")
    console.error(error)
    process.exit(1)
  }
}

export type Env = z.infer<typeof workerSchema> | z.infer<typeof apiSchema>
