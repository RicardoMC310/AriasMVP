import { writeFile } from "node:fs/promises";

import migrateDatabase from "./helpers/migrate.helper.js";
import createPostgresContainer from "./containers/postgres.container.js";

export default async function () {

    console.log("Preparing integration database...");

    const postgresContainer = await createPostgresContainer();
    const databaseUrl = postgresContainer.databaseUrl;
    await migrateDatabase(databaseUrl);

    await writeFile(
        ".integration.env",
        `DATABASE_URL=${databaseUrl}`
    );

    process.env.DATABASE_URL = databaseUrl;

}
