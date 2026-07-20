import { Kysely } from "kysely";
import VerifyEmailVerificationUseCase from "../../../../modules/email-verification/application/use-cases/verify-email-verification/verify-email-verification.use-case.js";
import { DB } from "../../../../platform/database/db.js";
import emailVerificationCodeGeneratorFactory from "../../dependencies/code-generator.compositor.js";
import kyselyEmailVerificationRepositoryFactory from "../../dependencies/repository.compositor.js";

export default function verifyEmailVerificationUseCaseFactory(db: Kysely<DB>) {
    const useCase = new VerifyEmailVerificationUseCase(
        emailVerificationCodeGeneratorFactory(),
        kyselyEmailVerificationRepositoryFactory(db)
    );

    useCase.registerObserver({
        execute: async (userId: string) => {
            console.log(userId);
        }
    });

    return useCase;
}