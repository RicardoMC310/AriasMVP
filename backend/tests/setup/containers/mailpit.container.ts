import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

export default async function createMailpitContainer() {
    const container: StartedTestContainer = await new GenericContainer("axllent/mailpit")
        .withExposedPorts(1025)
        .withExposedPorts(8025)
        .withWaitStrategy(
            Wait.forLogMessage("[http] accessible via http://localhost:8025/")
        )
        .start();

    return {
        container,
        host: container.getHost(),
        port: container.getMappedPort(1025),
        debugPort: container.getMappedPort(8025)
    }
}