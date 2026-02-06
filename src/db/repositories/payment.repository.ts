import { EntityManager } from "@mikro-orm/mysql"
import { Payment } from "../entities/payment.entity"

export class PaymentRepository {
  constructor(private readonly em: EntityManager) {}

  async create(data: {
    paymentId: string
    amount: number
    currency: string
    status: string
  }): Promise<Payment> {
    const payment = this.em.create(Payment, data)
    await this.em.persistAndFlush(payment)
    return payment
  }

  async findByPaymentId(paymentId: string): Promise<Payment | null> {
    return this.em.findOne(Payment, { paymentId })
  }

  async updateStatus(
    paymentId: string,
    status: string
  ): Promise<void> {
    await this.em.nativeUpdate(
      Payment,
      { paymentId },
      { status }
    )
  }
}