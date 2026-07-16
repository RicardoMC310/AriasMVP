import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset({
  useESM: true,
}).transform;

/** @type {import("jest").Config} */
export default {
  testEnvironment: "node",

  testMatch: [
    "**/*.unit.test.ts",
  ],

  extensionsToTreatAsEsm: [".ts"],

  transform: {
    ...tsJestTransformCfg,
  },

  injectGlobals: false,

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};