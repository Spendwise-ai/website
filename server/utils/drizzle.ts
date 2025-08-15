import * as schema from "../database/schema";
import * as methods from "../database/methods";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import env from "./env";

export const tables = schema;
//
// Construct DATABASE_URL from individual environment variables
const constructDatabaseUrl = () => {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || '5432';
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const database = process.env.POSTGRES_DB || 'postgres_db';

  return `postgres://${user}:${password}@${host}:${port}/${database}`;
};

const url = env.DATABASE_URL || constructDatabaseUrl();


export const db = drizzle(postgres(url), { schema, casing: "camelCase" });

export const dbMethods = methods;
