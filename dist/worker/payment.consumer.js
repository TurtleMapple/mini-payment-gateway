"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentConsumer = void 0;
const topology_1 = require("../rabbitmq/topology");
class PaymentConsumer {
    constructor(paymentRepo, channel) {
        this.paymentRepo = paymentRepo;
        this.channel = channel;
    }
    async startConsuming() {
        await this.channel.consume(topology_1.PAYMENT_CREATED_QUEUE, this.handlePaymentCreated.bind(this), { noAck: false });
        console.log("Payment consumer started");
    }
    async handlePaymentCreated(msg) {
        if (!msg)
            return;
        try {
            const event = JSON.parse(msg.content.toString());
            // Side-effect: Persist payment into DB (worker owns DB writes)
            const existing = await this.paymentRepo.findByPaymentId(event.paymentId);
            if (!existing) {
                await this.paymentRepo.create({
                    paymentId: event.paymentId,
                    amount: event.amount,
                    currency: event.currency,
                    status: "CREATED",
                });
            }
            console.log("Processed payment:", event.paymentId);
            this.channel.ack(msg);
        }
        catch (error) {
            console.error("Error processing payment event:", error);
            this.channel.nack(msg, false, false); // Dead letter
        }
    }
}
exports.PaymentConsumer = PaymentConsumer;
