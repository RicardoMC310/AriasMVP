import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
    useESM: true,
}).transform;

/** @type {import("jest").Config} **/

export default {
    testMatch: [
        "**/*.integration.test.ts"
    ],

    extensionsToTreatAsEsm: [".ts"],

    transform: {
        ...tsJestTransformCfg,
    },

    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },

    testEnvironment: "node",

    globalSetup: "./tests/setup/global-setup.ts",

    globalTeardown: "./tests/setup/global-teardown.ts",

    setupFilesAfterEnv: [
        "./tests/setup/global-after-env.ts"
    ]
};