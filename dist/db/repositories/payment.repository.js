"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const payment_entity_1 = require("../entities/payment.entity");
class PaymentRepository {
    constructor(em) {
        this.em = em;
    }
    async create(data) {
        const payment = this.em.create(payment_entity_1.Payment, data);
        await this.em.persistAndFlush(payment);
        return payment;
    }
    async findByPaymentId(paymentId) {
        return this.em.findOne(payment_entity_1.Payment, { paymentId });
    }
    async updateStatus(paymentId, status) {
        await this.em.nativeUpdate(payment_entity_1.Payment, { paymentId }, { status });
    }
}
exports.PaymentRepository = PaymentRepository;
