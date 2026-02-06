"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const zod_openapi_1 = require("@hono/zod-openapi");
const hono_api_reference_1 = require("@scalar/hono-api-reference");
const payments_route_1 = require("./routes/payments.route");
const health_route_1 = require("./routes/health.route");
const createApp = (createPaymentService) => {
    const app = new zod_openapi_1.OpenAPIHono();
    // Health Check
    app.route("/", (0, health_route_1.createHealthRoute)());
    // Routes
    app.route("/", (0, payments_route_1.paymentRoute)(createPaymentService));
    // OpenAPI JSON spec
    app.doc("/openapi.json", {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "Payment Notification API",
            description: "API for payment notifications with RabbitMQ",
        },
    });
    // Scalar UI Documentation
    app.get("/doc", (0, hono_api_reference_1.apiReference)({
        spec: {
            url: "/openapi.json",
        },
    }));
    // Redirect root to documentation
    app.get("/", (c) => {
        return c.redirect("/doc");
    });
    return app;
};
exports.createApp = createApp;
