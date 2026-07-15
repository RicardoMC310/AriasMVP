import { writeFile } from "node:fs/promises";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { Kysely, PostgresDialect } from "kysely";
import { Migrator, FileMigrationProvider } from "kysely/migration";
import { Pool } from "pg";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function () {

    console.log("Preparing integration database...");

    const container: StartedTestContainer = await new GenericContainer("postgres:18-alpine")
        .withExposedPorts(5432)
        .withEnvironment({
            POSTGRES_USER: "postgres",
            POSTGRES_PASSWORD: "postgres",
            POSTGRES_DB: "arias-test"
        })
        .withWaitStrategy(
            Wait.forListeningPorts()
        )
        .start();

    const host = container.getHost();
    const port = container.getMappedPort(5432);

    const databaseUrl = `postgresql://postgres:postgres@${host}:${port}/arias-test`;

    await writeFile(
        ".integration.env",
        `DATABASE_URL=${databaseUrl}`
    );

    process.env.DATABASE_URL = databaseUrl;

    const pool = new Pool({ connectionString: databaseUrl });

    const db = new Kysely({
        dialect: new PostgresDialect({ pool })
    });

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            path,
            fs,
            migrationFolder: path.resolve(__dirname, "../../src/platform/database/migrations"),
        }),
    });

    const { error } = await migrator.migrateToLatest();

    if (error) {
        throw error;
    }

    await pool.end();

}
