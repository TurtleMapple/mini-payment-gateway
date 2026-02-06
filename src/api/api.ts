import { CreatePaymentService } from "./services/create-payment.service"
import { RabbitMqPaymentPublisher } from "../rabbitmq/publisher/payment.publisher"
import { createRabbitMQConnection } from "../rabbitmq/connection"
import { createApp } from "./app"

export const createAPI = async () => {
  // RabbitMQ setup
  const rabbitConnection = await createRabbitMQConnection()
  const publisher = new RabbitMqPaymentPublisher(rabbitConnection)
  
  // Service with dependencies
  const createPaymentService = new CreatePaymentService(
    publisher
  )

  // Create app with dependencies
  return createApp(createPaymentService)
}