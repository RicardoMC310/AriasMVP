import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import RegisterUserUseCase from "../../../../modules/user/application/use-cases/register/register.use-case.js";
import kyselyUserRespositoryFactory from "../../dependencies/repository.compositor.js";
import userHasherFactory from "../../dependencies/hasher.compositor.js";
import createEmailVerificationUseCaseFactory from "../../../email-verification/use-cases/create-email-verification/create-email-verification.compositor.js";

export default function registerUserUseCaseFactory(db: Kysely<DB>) {
    const useCase = new RegisterUserUseCase(
        kyselyUserRespositoryFactory(db),
        userHasherFactory()
    );

    useCase.registerObserver(createEmailVerificationUseCaseFactory(db));

    return useCase;
}