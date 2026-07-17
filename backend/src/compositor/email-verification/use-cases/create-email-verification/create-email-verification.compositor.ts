import { Kysely } from "kysely";
import CreateEmailVerificationUseCase from "../../../../modules/email-verification/application/use-cases/create-email-verification/create-email-verification.use-case.js";
import emailVerificationCodeGeneratorFactory from "../../dependencies/code-generator.compositor.js";
import kyselyEmailVerificationRepositoryFactory from "../../dependencies/repository.compositor.js";
import { DB } from "../../../../platform/database/db.js";
import sendEmailVerificationUseCaseFactory from "../../../mailer/use-case/send-email-verification/send-email-verification.compositor.js";

export default function createEmailVerificationUseCaseFactory(db: Kysely<DB>) {
    const useCase = new CreateEmailVerificationUseCase(
        emailVerificationCodeGeneratorFactory(),
        kyselyEmailVerificationRepositoryFactory(db)
    );

    useCase.registerObserver(sendEmailVerificationUseCaseFactory());

    return useCase;
}