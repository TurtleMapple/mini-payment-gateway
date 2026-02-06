/**
 * Payload event yang dipublish oleh API saat payment "dibuat" (create request diterima).
 *
 * Catatan:
 * - Event ini adalah kontrak antar service (API -> RabbitMQ -> Worker).
 * - Worker akan mengonsumsi event ini dan menjalankan side-effect (mis. simpan ke DB, logging, dsb).
 */
export interface PaymentCreatedEvent {
    paymentId: string
    amount: number
    currency: string
}

/**
 * Abstraksi publisher agar layer API tidak bergantung ke implementasi message broker tertentu.
 * Dengan interface ini, kita bisa:
 * - mengganti RabbitMQ ke broker lain tanpa mengubah business logic service
 * - membuat mock publisher untuk testing
 */
export interface PaymentPublisher {
    publishPaymentCreated(
        event: PaymentCreatedEvent
    ): Promise<void>
}

import { PAYMENT_EXCHANGE, PAYMENT_CREATED_ROUTING_KEY } from "../topology"

/**
 * Implementasi publisher menggunakan RabbitMQ (amqplib).
 *
 * Konsep penting:
 * - Exchange: titik masuk message (di sini exchange bertipe "topic")
 * - Routing key: penentu route message dari exchange ke queue
 * - Queue dan binding didefinisikan di `src/rabbitmq/topology.ts`
 */
export class RabbitMqPaymentPublisher implements PaymentPublisher {
    private connection: any

    /**
     * `connection` adalah instance koneksi RabbitMQ yang dibuat sekali dan direuse.
     * (lihat `src/rabbitmq/connection.ts`)
     */
    constructor(connection: any) {
        this.connection = connection
    }

    /**
     * Publish event `payment.created` ke exchange `PAYMENT_EXCHANGE`.
     *
     * Implementasi detail:
     * - Membuat channel baru per publish (sederhana untuk mini project).
     * - `assertExchange(... durable: true)`: memastikan exchange ada dan survive broker restart.
     * - `persistent: true`: message di-mark persistent (akan ditulis ke disk jika queue durable).
     * - Channel selalu ditutup di `finally` untuk mencegah resource leak.
     */
    async publishPaymentCreated(event: PaymentCreatedEvent): Promise<void> {
        const channel = await this.connection.createChannel()
        
        try {
            await channel.assertExchange(PAYMENT_EXCHANGE, "topic", { durable: true })
            
            // Message dipublish ke exchange dengan routing key yang akan mem-bind ke queue consumer.
            channel.publish(
                PAYMENT_EXCHANGE,
                PAYMENT_CREATED_ROUTING_KEY,
                Buffer.from(JSON.stringify(event)),
                { persistent: true }
            )
        } finally {
            await channel.close()
        }
    }
}