import { Channel, ConsumeMessage } from "amqplib"
import { PaymentRepository } from "../db/repositories/payment.repository"
import { PaymentCreatedEvent } from "../rabbitmq/publisher/payment.publisher"
import { PAYMENT_CREATED_QUEUE } from "../rabbitmq/topology"

/**
 * Worker/consumer untuk event payment.
 *
 * Tanggung jawab utama:
 * - subscribe ke queue (`PAYMENT_CREATED_QUEUE`)
 * - parse message -> `PaymentCreatedEvent`
 * - menjalankan side-effect (di project ini: simpan payment ke DB)
 * - melakukan ack/nack untuk menentukan nasib message
 */
export class PaymentConsumer {
    constructor(
        private readonly paymentRepo: PaymentRepository,
        private readonly channel: Channel
    ) {}

    /**
     * Mulai consume message dari queue.
     *
     * `noAck: false` artinya kita melakukan ack manual:
     * - sukses -> `ack`
     * - gagal -> `nack` (di sini tidak requeue agar bisa masuk DLQ bila diset)
     */
    async startConsuming(): Promise<void> {
        await this.channel.consume(
            PAYMENT_CREATED_QUEUE,
            this.handlePaymentCreated.bind(this),
            { noAck: false }
        )
        
        console.log("Payment consumer started")
    }

    /**
     * Handler message untuk event `payment.created`.
     *
     * Flow:
     * - parse JSON payload
     * - idempotency check sederhana: jika `paymentId` sudah ada -> skip insert
     * - jika belum ada -> insert ke DB
     * - ack message jika sukses
     *
     * Error handling:
     * - jika parsing/DB error -> log error lalu `nack(msg, false, false)`
     *   (tidak requeue) supaya message tidak loop tanpa henti.
     */
    private async handlePaymentCreated(msg: ConsumeMessage | null): Promise<void> {
        if (!msg) return

        try {
            const event: PaymentCreatedEvent = JSON.parse(msg.content.toString())
            
            // Side-effect: Persist payment into DB (worker owns DB writes)
            const existing = await this.paymentRepo.findByPaymentId(event.paymentId)
            if (!existing) {
                await this.paymentRepo.create({
                    paymentId: event.paymentId,
                    amount: event.amount,
                    currency: event.currency,
                    status: "CREATED",
                })
            }

            console.log("Processed payment:", event.paymentId)
            
            this.channel.ack(msg)
        } catch (error) {
            console.error("Error processing payment event:", error)
            this.channel.nack(msg, false, false) // Dead letter
        }
    }
}
