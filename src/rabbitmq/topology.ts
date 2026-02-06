import { Channel } from "amqplib"

/**
 * Modul definisi topology RabbitMQ.
 *
 * Istilah:
 * - Exchange: titik masuk message dari producer.
 * - Routing key: “alamat” yang dipakai exchange untuk menentukan ke queue mana message dikirim.
 * - Queue: tempat message menunggu untuk dikonsumsi worker.
 * - Binding: aturan yang menghubungkan exchange + routing key -> queue.
 *
 * Catatan penting:
 * - `durable: true` pada exchange/queue artinya objeknya survive saat broker restart.
 * - Sementara `persistent: true` pada publish message (di publisher) menandai message agar persisten
 *   (efektif jika queue juga durable).
 */
// Exchange
export const PAYMENT_EXCHANGE = "payment.exchange"

// Routing Keys
export const PAYMENT_CREATED_ROUTING_KEY = "payment.created"

// Queues
export const PAYMENT_CREATED_QUEUE = "payment.created.queue"

/**
 * Setup topology yang dibutuhkan aplikasi.
 *
 * Biasanya dipanggil saat worker (consumer) start:
 * - memastikan exchange dan queue sudah ada
 * - memastikan binding sudah terpasang
 *
 * Dengan ini, producer bisa publish ke exchange tanpa perlu tahu detail queue.
 */
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