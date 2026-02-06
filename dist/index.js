"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config"); // ← Tambahkan ini
const mysql_1 = require("@mikro-orm/mysql");
const mikro_orm_config_1 = __importDefault(require("./db/mikro-orm.config"));
const connection_1 = require("./rabbitmq/connection");
const channel_1 = require("./rabbitmq/channel");
const topology_1 = require("./rabbitmq/topology");
const payment_repository_1 = require("./db/repositories/payment.repository");
const payment_consumer_1 = require("./worker/payment.consumer");
const server_1 = require("./server");
const env_1 = require("./api/config/env");
// Validate environment variables
(0, env_1.validateEnv)();
async function startWorker() {
    console.log("Starting worker...");
    // Database
    const orm = await mysql_1.MikroORM.init(mikro_orm_config_1.default);
    const em = orm.em.fork();
    const paymentRepo = new payment_repository_1.PaymentRepository(em);
    // RabbitMQ
    const connection = await (0, connection_1.createRabbitMQConnection)();
    const channel = await (0, channel_1.createChannel)();
    await (0, topology_1.setupRabbitMQTopology)(channel);
    // Consumer
    const consumer = new payment_consumer_1.PaymentConsumer(paymentRepo, channel);
    await consumer.startConsuming();
    console.log("Worker started");
}
async function bootstrap() {
    const mode = process.env.APP_MODE || "api";
    if (mode === "api") {
        await (0, server_1.startServer)();
    }
    else if (mode === "worker") {
        await startWorker();
    }
    else {
        console.error("Invalid APP_MODE. Use 'api' or 'worker'");
        process.exit(1);
    }
}
bootstrap().catch(console.error);
