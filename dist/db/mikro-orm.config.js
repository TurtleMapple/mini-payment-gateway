"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("@mikro-orm/mysql");
const payment_entity_1 = require("./entities/payment.entity");
exports.default = (0, mysql_1.defineConfig)({
    entities: [payment_entity_1.Payment],
    dbName: "mini_payment",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    migrations: {
        path: "src/db/migrations",
        tableName: "migrations",
    },
});
