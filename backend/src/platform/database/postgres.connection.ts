import { Pool } from "pg";
import { config as dotenvConfig } from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "./db.js";
dotenvConfig();

if (!process.env.DATABASE_URL) 
    throw new Error("Missing environment variable DATABASE_URL");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: pool
    })
});

export default db;