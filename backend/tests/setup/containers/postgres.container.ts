import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

export default async function createPostgresContainer() {
    const container: StartedTestContainer = await new GenericContainer("postgres:18-alpine")
        .withExposedPorts(5432)
        .withEnvironment({
            POSTGRES_USER: "postgres",
            POSTGRES_PASSWORD: "postgres",
            POSTGRES_DB: "arias-test"
        })
        .withWaitStrategy(
            Wait.forLogMessage("database system is ready to accept connections", 2)
        )
        .start();

    return {
        container,
        host: container.getHost(),
        port: container.getMappedPort(5432),
        databaseUrl: 
            `postgresql://postgres:postgres@${container.getHost()}:${container.getMappedPort(5432)}/arias-test`
    }
}