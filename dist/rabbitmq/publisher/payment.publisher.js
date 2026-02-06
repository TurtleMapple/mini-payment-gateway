"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMqPaymentPublisher = void 0;
const topology_1 = require("../topology");
class RabbitMqPaymentPublisher {
    constructor(connection) {
        this.connection = connection;
    }
    async publishPaymentCreated(event) {
        const channel = await this.connection.createChannel();
        try {
            await channel.assertExchange(topology_1.PAYMENT_EXCHANGE, "topic", { durable: true });
            channel.publish(topology_1.PAYMENT_EXCHANGE, topology_1.PAYMENT_CREATED_ROUTING_KEY, Buffer.from(JSON.stringify(event)), { persistent: true });
        }
        finally {
            await channel.close();
        }
    }
}
exports.RabbitMqPaymentPublisher = RabbitMqPaymentPublisher;
