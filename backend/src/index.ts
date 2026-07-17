import express from "express"
import makeRouter from "./router.js";
import errorMiddleware from "./platform/express/middleware/error.middleware.js";
import { createDatabase } from "./platform/database/kysely.connection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import loadEnv from "./platform/env/load.env.js";

(async () => {
    const db = createDatabase(loadEnv("DATABASE_URL"));

    const app = express();

    app.use(express.json());
    app.use(cors({
        origin: loadEnv("CORS_ORIGIN"),
        allowedHeaders: loadEnv("CORS_HEADERS"),
        methods: loadEnv("CORS_METHODS"),
        credentials: true
    }));
    app.use(cookieParser(loadEnv("COOKIE_SECRET")));

    app.use(makeRouter(db));

    const host = process.env.SERVER_HOST ?? "0.0.0.0";
    const port = Number(process.env.SERVER_PORT ?? 8080);

    app.use(errorMiddleware);

    app.listen(port, host, () => {
        console.log(`Running server in http://${host}:${port}`);
    });
    
})().catch(err => {
    console.log(err);
    process.exit(1);
});