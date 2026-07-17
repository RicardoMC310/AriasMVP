import { Kysely } from "kysely";
import AuthLoginUseCase from "../../../../modules/auth/application/use-case/login/login.use-case.js";
import findUserByEmailUseCaseFactory from "../../../user/use-cases/find-user-by-email/find-user-by-email.compositor.js";
import { DB } from "../../../../platform/database/db.js";
import authArgonHasherFactory from "../../dependencies/hasher.compositor.js";
import authTokenGeneratorFactory from "../../dependencies/token-generator.compositor.js";

export default function authLoginUseCaseFactory(db: Kysely<DB>) {
    return new AuthLoginUseCase(
        findUserByEmailUseCaseFactory(db),
        authArgonHasherFactory(),
        authTokenGeneratorFactory()
    )
}