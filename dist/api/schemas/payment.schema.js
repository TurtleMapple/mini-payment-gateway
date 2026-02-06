"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaymentResponseSchema = exports.CreatePaymentSchema = void 0;
const zod_1 = require("zod");
exports.CreatePaymentSchema = zod_1.z.object({
    amount: zod_1.z.number().int().positive(),
    currency: zod_1.z.string().length(3),
});
exports.CreatePaymentResponseSchema = zod_1.z.object({
    payment_id: zod_1.z.string(),
    status: zod_1.z.literal("CREATED"),
});
