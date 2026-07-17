import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import express from "express";
import authControllerFactory from "../controller/controller.compositor.js";
import { HttpController } from "../../../platform/express/http-controller.express.js";

export default function authRouterFactory(db: Kysely<DB>): HttpController {
    const controller = authControllerFactory(db);

    const router = express.Router();

    router.post("/login", controller.login);

    return {
        router,
        prefix: "/auth"
    };
}