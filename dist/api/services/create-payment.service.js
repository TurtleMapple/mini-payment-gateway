"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentService = void 0;
const uuid_1 = require("uuid");
class CreatePaymentService {
    constructor(publisher) {
        this.publisher = publisher;
    }
    async execute(input) {
        const paymentId = (0, uuid_1.v7)();
        await this.publisher.publishPaymentCreated({
            paymentId,
            amount: input.amount,
            currency: input.currency,
        });
        return {
            payment_id: paymentId,
            status: "CREATED",
        };
    }
}
exports.CreatePaymentService = CreatePaymentService;
