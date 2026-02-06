"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRabbitMQConnection = exports.createRabbitMQConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let connection = null;
const createRabbitMQConnection = async () => {
    // Reuse existing connection
    if (connection) {
        return connection;
    }
    const url = process.env.RABBITMQ_URL || "amqp://localhost:5672";
    try {
        connection = await amqplib_1.default.connect(url);
        console.log("Connected to RabbitMQ");
        connection.on("close", () => {
            console.log("RabbitMQ connection closed");
            connection = null; // Reset untuk reconnect
        });
        connection.on("error", (err) => {
            console.error("RabbitMQ connection error:", err);
            connection = null; // Reset untuk reconnect
        });
        return connection;
    }
    catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw error;
    }
};
exports.createRabbitMQConnection = createRabbitMQConnection;
exports.getRabbitMQConnection = exports.createRabbitMQConnection;
