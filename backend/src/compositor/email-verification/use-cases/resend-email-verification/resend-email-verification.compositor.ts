import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import ResendEmailVerificationUseCase from "../../../../modules/email-verification/application/use-cases/resend-email-verification/resend-email-verification.use-case.js";
import kyselyEmailVerificationRepositoryFactory from "../../dependencies/repository.compositor.js";
import emailVerificationCodeGeneratorFactory from "../../dependencies/code-generator.compositor.js";
import sendEmailVerificationUseCaseFactory from "../../../mailer/use-case/send-email-verification/send-email-verification.compositor.js";

export default function resendEmailVerificationUseCaseFactory(db: Kysely<DB>) {
    const useCase = new ResendEmailVerificationUseCase(
        kyselyEmailVerificationRepositoryFactory(db),
        emailVerificationCodeGeneratorFactory()
    )

    useCase.registerObserver(
        sendEmailVerificationUseCaseFactory()
    );

    return useCase;
}