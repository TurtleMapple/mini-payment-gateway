export interface PaymentCreatedEvent {
    paymentId: string
    amount: number
    currency: string
}

export interface PaymentPublisher {
    publishPaymentCreated(
        event: PaymentCreatedEvent
    ): Promise<void>
}

import { Connection, Channel } from "amqplib"
import * as amqp from "amqplib";
import { PAYMENT_EXCHANGE, PAYMENT_CREATED_ROUTING_KEY } from "../topology"

export class RabbitMqPaymentPublisher implements PaymentPublisher {
    private connection: any

    constructor(connection: any) {
        this.connection = connection
    }

    async publishPaymentCreated(event: PaymentCreatedEvent): Promise<void> {
        const channel = await this.connection.createChannel()
        
        try {
            await channel.assertExchange(PAYMENT_EXCHANGE, "topic", { durable: true })
            
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