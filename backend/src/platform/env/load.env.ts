import { config as dotenvConfig } from "dotenv"

dotenvConfig();

export default function loadEnv(key: string, defaultValue?: string): string {
    const value = process.env[key];

    if (value) return value;
    if (defaultValue) return defaultValue;

    throw new Error("Missing environment variable " + key);
}