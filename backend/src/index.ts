import express, { Express } from "express"
import { config as dotenvConfig } from "dotenv";
import makeRouter from "./router.js";
import errorMiddleware from "./platform/express/middleware/error.middleware.js";
dotenvConfig();

(async () => {
    const app: Express = express();

    app.use(express.json());
    app.use(makeRouter());

    const host = process.env.SERVER_HOST ?? "0.0.0.0";
    const port = Number(process.env.SERVER_PORT ?? 8080);

    app.use(errorMiddleware);

    app.listen(port, host, () => {
        console.log(`Running server in http://${host}:${port}`);
    });
})()