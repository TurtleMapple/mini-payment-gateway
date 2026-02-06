import amqp from "amqplib"

/**
 * Modul ini bertanggung jawab untuk membuat dan me-manage *singleton* koneksi RabbitMQ.
 *
 * Kenapa dibuat singleton?
 * - Koneksi RabbitMQ relatif mahal untuk dibuat berulang-ulang.
 * - Producer/consumer dapat membuat banyak channel di atas satu koneksi yang sama.
 *
 * Catatan:
 * - Kalau koneksi terputus (`close`/`error`), kita reset ke `null` supaya pemanggilan berikutnya bisa reconnect.
 * - URL diambil dari env `RABBITMQ_URL` dengan default `amqp://localhost:5672`.
 */
let connection: any = null

/**
 * Create (atau reuse) koneksi RabbitMQ.
 *
 * Flow:
 * - Jika `connection` sudah ada -> reuse
 * - Jika belum -> connect, pasang listener `close` dan `error`, lalu return connection
 */
export const createRabbitMQConnection = async () => {
    // Reuse existing connection
    if (connection) {
        return connection
    }

    const url = process.env.RABBITMQ_URL || "amqp://localhost:5672"

    try {
        connection = await amqp.connect(url)
        console.log("Connected to RabbitMQ")

        connection.on("close", () => {
            console.log("RabbitMQ connection closed")
            connection = null // Reset untuk reconnect
        })

        connection.on("error", (err: Error) => {
            console.error("RabbitMQ connection error:", err)
            connection = null // Reset untuk reconnect
        })

        return connection
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error)
        throw error
    }
}

/**
 * Alias yang lebih “deskriptif” untuk dipakai module lain.
 * Secara implementasi sama persis dengan `createRabbitMQConnection`.
 */
export const getRabbitMQConnection = createRabbitMQConnection