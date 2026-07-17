import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import AuthController from "../../../modules/auth/presentation/controller/auth.controller.js";
import authLoginUseCaseFactory from "../use-case/login/login.compositor.js";

export default function authControllerFactory(db: Kysely<DB>) {
    return new AuthController(
        authLoginUseCaseFactory(db)
    );
}