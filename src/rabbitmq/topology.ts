import { Channel } from "amqplib"

// Exchange
export const PAYMENT_EXCHANGE = "payment.exchange"

// Routing Keys
export const PAYMENT_CREATED_ROUTING_KEY = "payment.created"

// Queues
export const PAYMENT_CREATED_QUEUE = "payment.created.queue"

export const setupRabbitMQTopology = async (channel: Channel) => {
    // Ensure exchange exists
    await channel.assertExchange(PAYMENT_EXCHANGE, "topic", { durable: true })

    // Ensure queue exists
    await channel.assertQueue(PAYMENT_CREATED_QUEUE, { durable: true })

    // Bind queue to exchange with routing key
    await channel.bindQueue(
        PAYMENT_CREATED_QUEUE,
        PAYMENT_EXCHANGE,
        PAYMENT_CREATED_ROUTING_KEY
    )

    console.log("RabbitMQ topology setup complete")
}