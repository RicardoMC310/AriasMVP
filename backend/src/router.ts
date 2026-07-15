import express, { Request, Response, type Router } from "express";
import createHttpResponse from "./platform/express/create-response.express.js";
import makeUserRouter from "./modules/user/presentation/controller/user.router.js";

export default function makeRouter(): Router {
    const router: Router = express.Router();

    router.get("/healthy", (_req: Request, res: Response) => {
        const response = createHttpResponse();
        res.status(200).json(response);
    });

    const userRouter = makeUserRouter();

    router.use(userRouter.prefix, userRouter.router);

    return router;
}