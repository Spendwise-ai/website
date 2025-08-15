import { defineConfig } from "drizzle-kit";

const user = process.env.DATABASE_USER
const password = process.env.DATABASE_PASSWORD
const host = process.env.DATABASE_HOST
const port = process.env.DATABASE_PORT
const database = process.env.DATABASE_NAME
const driver = "postgresql"

const DATABASE_URL = `${driver}://${user}:${password}@${host}:${port}/${database}`
export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/schema/index.ts",
  out: "./server/database/migrations",

  dbCredentials: {
    url: DATABASE_URL
  },
});
