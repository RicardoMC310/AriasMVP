import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import EmailVericationController from "../../../modules/email-verification/presentation/controller/email-verification.controller.js";

export default function emailVerificationControllerFactory(db: Kysely<DB>) {
    return new EmailVericationController();
}