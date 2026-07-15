import express, { Request, Response, type Router } from "express";
import createHttpResponse from "./platform/express/create-response.express.js";
import makeUserRouter from "./modules/user/presentation/controller/user.router.js";
import { Kysely } from "kysely";
import { DB } from "./platform/database/db.js";

export default function makeRouter(db: Kysely<DB>): Router {
    const router: Router = express.Router();

    router.get("/healthy", (_req: Request, res: Response) => {
        const response = createHttpResponse();
        res.status(200).json(response);
    });

    const userRouter = makeUserRouter(db);

    router.use(userRouter.prefix, userRouter.router);

    return router;
}