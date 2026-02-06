"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthRoute = void 0;
const zod_openapi_1 = require("@hono/zod-openapi");
const healthRoute = (0, zod_openapi_1.createRoute)({
    method: "get",
    path: "/health",
    responses: {
        200: {
            description: "Health check response",
            content: {
                "application/json": {
                    schema: zod_openapi_1.z.object({
                        status: zod_openapi_1.z.literal("ok"),
                        timestamp: zod_openapi_1.z.string(),
                        service: zod_openapi_1.z.string(),
                    }),
                },
            },
        },
    },
});
const createHealthRoute = () => {
    const app = new zod_openapi_1.OpenAPIHono();
    app.openapi(healthRoute, (c) => {
        return c.json({
            status: "ok",
            timestamp: new Date().toISOString(),
            service: "payment-notification-api",
        });
    });
    return app;
};
exports.createHealthRoute = createHealthRoute;
