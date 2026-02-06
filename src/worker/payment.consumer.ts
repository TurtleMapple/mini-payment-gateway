import { Channel, ConsumeMessage } from "amqplib"
import { PaymentRepository } from "../db/repositories/payment.repository"
import { PaymentCreatedEvent } from "../rabbitmq/publisher/payment.publisher"
import { PAYMENT_CREATED_QUEUE } from "../rabbitmq/topology"

export class PaymentConsumer {
    constructor(
        private readonly paymentRepo: PaymentRepository,
        private readonly channel: Channel
    ) {}

    async startConsuming(): Promise<void> {
        await this.channel.consume(
            PAYMENT_CREATED_QUEUE,
            this.handlePaymentCreated.bind(this),
            { noAck: false }
        )
        
        console.log("Payment consumer started")
    }

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
