"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPI = void 0;
const create_payment_service_1 = require("./services/create-payment.service");
const payment_publisher_1 = require("../rabbitmq/publisher/payment.publisher");
const connection_1 = require("../rabbitmq/connection");
const app_1 = require("./app");
const createAPI = async () => {
    // RabbitMQ setup
    const rabbitConnection = await (0, connection_1.createRabbitMQConnection)();
    const publisher = new payment_publisher_1.RabbitMqPaymentPublisher(rabbitConnection);
    // Service with dependencies
    const createPaymentService = new create_payment_service_1.CreatePaymentService(publisher);
    // Create app with dependencies
    return (0, app_1.createApp)(createPaymentService);
};
exports.createAPI = createAPI;
