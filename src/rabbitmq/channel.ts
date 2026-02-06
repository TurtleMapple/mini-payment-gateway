import { Channel } from "amqplib"
import { getRabbitMQConnection } from "./connection"

/**
 * Helper untuk membuat RabbitMQ channel dari koneksi yang direuse (lihat `connection.ts`).
 *
 * Kenapa channel dipisah dari connection?
 * - Di RabbitMQ, operasi publish/consume dilakukan via channel, bukan langsung lewat connection.
 * - Satu connection bisa punya banyak channel.
 *
 * Di sini kita juga memasang handler event:
 * - `error`: untuk log error channel
 * - `close`: untuk log saat channel tertutup
 */
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
