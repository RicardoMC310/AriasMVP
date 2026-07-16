import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import { HttpController } from "../../../../platform/express/http-controller.express.js";
import express from "express";
import EmailVerificationController from "./email-verification.controller.js";

export default function makeEmailVerificationRouter(db: Kysely<DB>): HttpController {
    const emailVerificationController = makeController(db);

    const router = express.Router();

    router.post("/resend", emailVerificationController.resend);

    return {
        router,
        prefix: "/auth/email-verification"
    }
}

function makeController(db: Kysely<DB>): EmailVerificationController {
    const controller = new EmailVerificationController();

    return controller;
}