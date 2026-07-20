import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import express from "express";
import { HttpController } from "../../../platform/express/http-controller.express.js";
import emailVerificationControllerFactory from "../controller/controller.compositor.js";
import makeRegisterRouter, { body, Registry, response, responses } from "../../../platform/express/register-router.express.js";
import { ResendEmailVerificationDTOSchema } from "../../../modules/email-verification/application/dto/in/resend-email-verification/resend-email-verification.dto.js";
import { VerifyEmailVerificationRequestDTOSchema } from "../../../modules/email-verification/application/dto/in/verify-email-verifcation/verify-email-verification.dto.js";

export default function emailVerificationRouterFactory(db: Kysely<DB>): HttpController {
    const controller = emailVerificationControllerFactory(db);

    // const router = express.Router();

    // router.post("/resend", controller.resend);
    // router.post("/verify", controller.verify);

    const registry = makeRegisterRouter();

    registry.group("/auth/email-verification", (registry: Registry) => {

        registry.registerRoutePath({

            handler: controller.resend,
            path: "/resend",

            docs: {

                description: "Resend Email verification",

                body: body(ResendEmailVerificationDTOSchema, true, {
                    email: "example@gmail.com"
                }),

                responses: responses(
                    response(200, "Check your email inbox", "SUCCESSFULY")
                )

            }

        }).post()

        registry.registerRoutePath({

            handler: controller.verify,
            path: "/verify",

            docs: {

                description: "Verify Email Verification",

                body: body(VerifyEmailVerificationRequestDTOSchema, true, {
                    email: "example@gmail.com",
                    token: "<8 digits>"
                }),

                responses: responses(
                    response(200, "User Verified", "SUCCESSFULY")
                )

            }

        }).post();

    });

    return {
        router: registry.getRouter()
    };
}