import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";
import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import KyselyEmailVerificationRepository from "./kysely.infra.js";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";
import CreateEmailVerificationUseCase from "../../application/use-cases/create-email-verification/create-email-verification.use-case.js";
import EmailVericationCodeGenerator from "../code/code-generator.infra.js";

describe("Teste de integração com kysely com o módulo de verificação de email", () => {
    let db: Kysely<DB>
    let kyselyEmailVerificationRepository: KyselyEmailVerificationRepository;

    beforeEach(async () => {
        if (process.env.DATABASE_URL === undefined)
            throw new Error("Missing environment variable DATABASE_URL");

        db = createDatabase(process.env.DATABASE_URL);
        kyselyEmailVerificationRepository = new KyselyEmailVerificationRepository(db);

        await db.deleteFrom("email_verification").execute();
    });

    afterEach(async () => {
        await db.destroy();
    });

    it("Deve poder registrar uma nova verificação de email", async () => {
        const body = {
            email: "ricardo@gmail.com",
            userId: crypto.randomUUID()
        };

        await db.insertInto("users")
            .values({
                id: body.userId,
                email: body.email,
                name: "ricardo",
                password_hash: "hashed:12345678",
                state: "VERIFICATION_PENDING"
            })
            .execute();

        const emailVerificatioCodeGenerator = new EmailVericationCodeGenerator();
        const createEmailVerificationUseCase = new CreateEmailVerificationUseCase(
            emailVerificatioCodeGenerator,
            kyselyEmailVerificationRepository
        );

        await expect(createEmailVerificationUseCase.execute(body)).resolves.not.toThrow();

        const emailVerification = await db.selectFrom("users")
            .innerJoin("email_verification", (join) => 
                join.onRef("email_verification.user_id", "=", "users.id")
            )
            .select([
                "attempts",
                "email_verification.id as id",
                "user_id",
                "expiresAt",
                "email",
                "verified"
            ])
            .executeTakeFirst();

        expect(emailVerification!.id).toBeDefined();
        expect(emailVerification!.email).toBe(body.email);
        expect(emailVerification!.user_id).toBe(body.userId);
        expect(emailVerification!.attempts).toBe(0);
        expect(emailVerification!.verified).toBe(false);
        expect(emailVerification!.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

});