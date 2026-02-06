import "reflect-metadata"
import "dotenv/config"  // ← Tambahkan ini
import { MikroORM } from "@mikro-orm/mysql"
import config from "./db/mikro-orm.config"
import { createRabbitMQConnection } from "./rabbitmq/connection"
import { createChannel } from "./rabbitmq/channel"
import { setupRabbitMQTopology } from "./rabbitmq/topology"
import { PaymentRepository } from "./db/repositories/payment.repository"
import { PaymentConsumer } from "./worker/payment.consumer"
import { startServer } from "./server"
import { validateEnv } from "./api/config/env"

// Validate environment variables
validateEnv()

async function startWorker() {
  console.log("Starting worker...")
  
  // Database
  const orm = await MikroORM.init(config)
  const em = orm.em.fork()
  const paymentRepo = new PaymentRepository(em)
  
  // RabbitMQ
  const connection = await createRabbitMQConnection()
  const channel = await createChannel()
  await setupRabbitMQTopology(channel)
  
  // Consumer
  const consumer = new PaymentConsumer(paymentRepo, channel)
  await consumer.startConsuming()
  
  console.log("Worker started")
}

async function bootstrap() {
  const mode = process.env.APP_MODE || "api"
  
  if (mode === "api") {
    await startServer()
  } else if (mode === "worker") {
    await startWorker()
  } else {
    console.error("Invalid APP_MODE. Use 'api' or 'worker'")
    process.exit(1)
  }
}

bootstrap().catch(console.error)