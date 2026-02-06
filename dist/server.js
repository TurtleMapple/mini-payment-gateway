"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const node_server_1 = require("@hono/node-server");
const api_1 = require("./api/api");
async function startServer() {
    const app = await (0, api_1.createAPI)();
    const port = Number(process.env.PORT) || 3000;
    (0, node_server_1.serve)({
        fetch: app.fetch,
        port
    });
    console.log(`API server running on http://localhost:${port}`);
}
