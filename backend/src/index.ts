import express, { Express } from "express"
import { config as dotenvConfig } from "dotenv";
import makeRouter from "./router.js";
import errorMiddleware from "./platform/express/middleware/error.middleware.js";
import { createDatabase } from "./platform/database/kysely.connection.js";
dotenvConfig();

(async () => {
    
    if (process.env.DATABASE_URL === undefined)
        throw new Error("Missing environment variable DATABASE_URL");

    const db = createDatabase(process.env.DATABASE_URL);

    const app: Express = express();

    app.use(express.json());
    app.use(makeRouter(db));

    const host = process.env.SERVER_HOST ?? "0.0.0.0";
    const port = Number(process.env.SERVER_PORT ?? 8080);

    app.use(errorMiddleware);

    app.listen(port, host, () => {
        console.log(`Running server in http://${host}:${port}`);
    });
})()