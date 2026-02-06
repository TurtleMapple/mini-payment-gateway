"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChannel = createChannel;
const connection_1 = require("./connection");
async function createChannel() {
    const connection = await (0, connection_1.getRabbitMQConnection)();
    const channel = await connection.createChannel();
    channel.on("error", (err) => {
        console.error("RabbitMQ channel error", err);
    });
    channel.on("close", () => {
        console.warn("RabbitMQ channel closed");
    });
    return channel;
}
