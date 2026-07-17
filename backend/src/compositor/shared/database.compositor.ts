import { createDatabase } from "../../platform/database/kysely.connection.js";
import loadEnv from "../../platform/env/load.env.js";

export default function connectionDatabaseFactory() {
    return createDatabase(loadEnv("DATABASE_URL"));
}