import amqp from "amqplib"

let connection: any = null

export const createRabbitMQConnection = async () => {
    // Reuse existing connection
    if (connection) {
        return connection
    }

    const url = process.env.RABBITMQ_URL || "amqp://localhost:5672"

    try {
        connection = await amqp.connect(url)
        console.log("Connected to RabbitMQ")

        connection.on("close", () => {
            console.log("RabbitMQ connection closed")
            connection = null // Reset untuk reconnect
        })

        connection.on("error", (err: Error) => {
            console.error("RabbitMQ connection error:", err)
            connection = null // Reset untuk reconnect
        })

        return connection
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error)
        throw error
    }
}

export const getRabbitMQConnection = createRabbitMQConnection