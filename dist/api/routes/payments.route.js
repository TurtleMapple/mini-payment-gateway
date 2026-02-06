"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const zod_openapi_1 = require("@hono/zod-openapi");
const payment_schema_1 = require("../schemas/payment.schema");
const createPaymentRoute = (0, zod_openapi_1.createRoute)({
    method: "post",
    path: "/payments",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: payment_schema_1.CreatePaymentSchema,
                },
            },
        },
    },
    responses: {
        202: {
            description: "Payment created",
            content: {
                "application/json": {
                    schema: payment_schema_1.CreatePaymentResponseSchema,
                },
            },
        },
    },
});
const paymentRoute = (createPaymentService) => {
    const app = new zod_openapi_1.OpenAPIHono();
    app.openapi(createPaymentRoute, async (c) => {
        const input = c.req.valid("json");
        const result = await createPaymentService.execute(input);
        return c.json(result, 202);
    });
    return app;
};
exports.paymentRoute = paymentRoute;
