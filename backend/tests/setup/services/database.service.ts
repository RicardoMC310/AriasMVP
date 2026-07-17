import { TestService } from "../integration-environments";
import migrateDatabase from "../helpers/migrate.helper.js";
import createPostgresContainer from "../containers/postgres.container.js";

export default async function upDatabase(): Promise<TestService> {
    console.log("Preparing integration database...");

    const postgresContainer = await createPostgresContainer();
    const databaseUrl = postgresContainer.databaseUrl;

    await migrateDatabase(databaseUrl);

    return {
        container: postgresContainer.container,
        variables: [
            { name: "DATABASE_URL", value: databaseUrl }
        ]
    };
}