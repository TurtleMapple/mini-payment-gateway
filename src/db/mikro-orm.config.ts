import { defineConfig } from "@mikro-orm/mysql"
import { Payment } from "./entities/payment.entity"

export default defineConfig({
  entities: [Payment],
  dbName: "mini_payment",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  migrations: {
    path: "src/db/migrations",
    tableName: "migrations",
  },
})
