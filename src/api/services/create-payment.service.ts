import { PaymentPublisher } from "../../rabbitmq/publisher/payment.publisher"
import { v7 as uuidv7 } from "uuid"

export class CreatePaymentService {
    constructor(
      private readonly publisher: PaymentPublisher
    ) {}
  
    async execute(input: {
      amount: number
      currency: string
    }) {
      const paymentId = uuidv7()
  
      await this.publisher.publishPaymentCreated({
        paymentId,
        amount: input.amount,
        currency: input.currency,
      })
  
      return {
        payment_id: paymentId,
        status: "CREATED" as const,
      }
    }
  }
  