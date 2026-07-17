import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import registerUserUseCaseFactory from "../use-cases/register/register.compositor.js";
import UserController from "../../../modules/user/presentation/controller/user.controller.js";

export default function userControllerFactory(db: Kysely<DB>) {
    return new UserController(
        registerUserUseCaseFactory(db)
    );
}