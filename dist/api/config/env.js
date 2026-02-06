"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const zod_1 = require("zod");
const baseSchema = zod_1.z.object({
    // RabbitMQ
    RABBITMQ_URL: zod_1.z.string().default("amqp://localhost:5672"),
    // Application
    APP_MODE: zod_1.z.enum(["api", "worker"]),
    PORT: zod_1.z.string().default("3000"),
});
const workerSchema = baseSchema.extend({
    APP_MODE: zod_1.z.literal("worker"),
    // Database (required for worker)
    DB_USER: zod_1.z.string().min(1, "DB_USER is required"),
    DB_PASSWORD: zod_1.z.string(), // allow empty password
    DB_HOST: zod_1.z.string().default("localhost"),
    DB_PORT: zod_1.z.string().default("3306"),
});
const apiSchema = baseSchema.extend({
    APP_MODE: zod_1.z.literal("api"),
    // Database vars intentionally optional for API mode
    DB_USER: zod_1.z.string().optional(),
    DB_PASSWORD: zod_1.z.string().optional(),
    DB_HOST: zod_1.z.string().optional(),
    DB_PORT: zod_1.z.string().optional(),
});
function validateEnv() {
    try {
        const mode = (process.env.APP_MODE || "api");
        const env = mode === "worker"
            ? workerSchema.parse({ ...process.env, APP_MODE: "worker" })
            : apiSchema.parse({ ...process.env, APP_MODE: "api" });
        console.log("✅ Environment variables validated");
        return env;
    }
    catch (error) {
        console.error("❌ Environment validation failed:");
        console.error(error);
        process.exit(1);
    }
}
