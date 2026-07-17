import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "./db.js";

export function createDatabase(connectionString: string): Kysely<DB> {
    const pool = new Pool({
        connectionString
    });

    return new Kysely<DB>({
        dialect: new PostgresDialect({
            pool
        }),
    });
}