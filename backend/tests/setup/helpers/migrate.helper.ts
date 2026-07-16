import { Kysely, PostgresDialect } from "kysely";
import { Migrator, FileMigrationProvider } from "kysely/migration";
import path from "node:path";
import { Pool } from "pg";
import { promises as fs } from "node:fs";

const __dirname = import.meta.dirname!;

export default async function migrateDatabase(databaseUrl: string): Promise<void> {
    const pool = new Pool({ connectionString: databaseUrl });

    const db = new Kysely({
        dialect: new PostgresDialect({ pool })
    });

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            path,
            fs,
            migrationFolder: path.resolve(__dirname, "../../../src/platform/database/migrations"),
        }),
    });

    const { error } = await migrator.migrateToLatest();

    if (error) {
        throw error;
    }

    pool.on("error", (err) => {});

    await pool.end();
}