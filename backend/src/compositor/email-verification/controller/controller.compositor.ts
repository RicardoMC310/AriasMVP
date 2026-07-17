import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import EmailVericationController from "../../../modules/email-verification/presentation/controller/email-verification.controller.js";
import resendEmailVerificationUseCaseFactory from "../use-cases/resend-email-verification.compositot.ts/resend-email-verification.compositor.js";

export default function emailVerificationControllerFactory(db: Kysely<DB>) {
    return new EmailVericationController(
        resendEmailVerificationUseCaseFactory(db)
    );
}