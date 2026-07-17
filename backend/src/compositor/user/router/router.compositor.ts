import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import { HttpController } from "../../../platform/express/http-controller.express.js";
import express from "express";
import userControllerFactory from "../controller/controller.compositor.js";

export default function userRouterFactory(db: Kysely<DB>): HttpController {
    const controller = userControllerFactory(db);

    const router = express.Router();

    router.post("/register", controller.register);

    return {
        router,
        prefix: "/user"
    };
}