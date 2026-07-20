import express, { Request, Response, type Router } from "express";
import createHttpResponse from "./platform/express/create-response.express.js";
import { Kysely } from "kysely";
import { DB } from "./platform/database/db.js";
import userRouterFactory from "./compositor/user/router/router.compositor.js";
import authRouterFactory from "./compositor/auth/router/router.compositor.js";
import emailVerificationRouterFactory from "./compositor/email-verification/router/router.compositor.js";

export default function makeRouter(db: Kysely<DB>): Router {
    const router: Router = express.Router();

    router.get("/healthy", (_req: Request, res: Response) => {
        const response = createHttpResponse();
        res.status(200).json(response);
    });

    const userRouter = userRouterFactory(db);
    const authRouter = authRouterFactory(db);
    const emailVerificationRouter = emailVerificationRouterFactory(db);

    router.use(userRouter.router);
    router.use(authRouter.router);
    router.use(emailVerificationRouter.router);

    return router;
}