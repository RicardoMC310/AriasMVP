import { writeFile } from "node:fs/promises";
import { StartedTestContainer } from "testcontainers";

import upDatabase from "./services/database.service.js";
import upMailpit from "./services/mailpit.service.js";

const envFilename = ".integration.env";

export type EnvironmentVariable = {
    name: string;
    value: string;
};

export type TestService = {
    container: StartedTestContainer,
    variables: readonly EnvironmentVariable[],
    cleanup?: () => Promise<void>;
};

const envVars: EnvironmentVariable[] = [];

let services: TestService[] = [];

export async function setup() {
    // quebrando a linha para os logs seguintes
    console.log();

    services = [
        await upDatabase(),
        await upMailpit()
    ];

    for (const service of services) {
        registerService(service);
    }

    await saveInEnvFile(envVars);
}

async function saveInEnvFile(envVars: EnvironmentVariable[]) {
    const content = envVars
        .map(variable =>
            `${variable.name}=${variable.value}`
        )
        .join("\n");


    await writeFile(
        envFilename,
        content
    );

    for (const variable of envVars) {
        process.env[variable.name] = variable.value;
    }
}

function registerService(service: TestService) {
    envVars.push(...service.variables);
}

export async function teardown() {
    for (const service of services) {
        await service.cleanup?.();
        await service.container.stop();
    }
}