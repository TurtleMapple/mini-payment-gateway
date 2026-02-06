import { Channel } from "amqplib"
import { getRabbitMQConnection } from "./connection"

export async function createChannel(): Promise<Channel> {
  const connection = await getRabbitMQConnection()
  const channel = await connection.createChannel()

  channel.on("error", (err: Error) => {
    console.error("RabbitMQ channel error", err)
  })

  channel.on("close", () => {
    console.warn("RabbitMQ channel closed")
  })

  return channel
}
