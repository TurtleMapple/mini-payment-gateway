"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRabbitMQTopology = exports.PAYMENT_CREATED_QUEUE = exports.PAYMENT_CREATED_ROUTING_KEY = exports.PAYMENT_EXCHANGE = void 0;
// Exchange
exports.PAYMENT_EXCHANGE = "payment.exchange";
// Routing Keys
exports.PAYMENT_CREATED_ROUTING_KEY = "payment.created";
// Queues
exports.PAYMENT_CREATED_QUEUE = "payment.created.queue";
const setupRabbitMQTopology = async (channel) => {
    // Ensure exchange exists
    await channel.assertExchange(exports.PAYMENT_EXCHANGE, "topic", { durable: true });
    // Ensure queue exists
    await channel.assertQueue(exports.PAYMENT_CREATED_QUEUE, { durable: true });
    // Bind queue to exchange with routing key
    await channel.bindQueue(exports.PAYMENT_CREATED_QUEUE, exports.PAYMENT_EXCHANGE, exports.PAYMENT_CREATED_ROUTING_KEY);
    console.log("RabbitMQ topology setup complete");
};
exports.setupRabbitMQTopology = setupRabbitMQTopology;
