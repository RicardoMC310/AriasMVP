import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import express from "express";
import { HttpController } from "../../../platform/express/http-controller.express.js";
import emailVerificationControllerFactory from "../controller/controller.compositor.js";

export default function emailVerificationRouterFactory(db: Kysely<DB>): HttpController {
    const controller = emailVerificationControllerFactory(db);

    const router = express.Router();

    router.post("/resend", controller.resend);

    return {
        router,
        prefix: "/auth/email-verification"
    }
}