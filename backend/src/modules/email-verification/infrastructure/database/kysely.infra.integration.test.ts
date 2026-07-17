import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";
import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import KyselyEmailVerificationRepository from "./kysely.infra.js";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";
import CreateEmailVerificationUseCase from "../../application/use-cases/create-email-verification/create-email-verification.use-case.js";
import EmailVericationCodeGenerator from "../code/code-generator.infra.js";
import resendEmailVerificationUseCaseFactory from "../../../../compositor/email-verification/use-cases/resend-email-verification.compositot.ts/resend-email-verification.compositor.js";
import ResendEmailVerificationUseCase from "../../application/use-cases/resend-email-verification/resend-email-verification.use-case.js";

describe("Teste de integração com kysely com o módulo de verificação de email", () => {
    let db: Kysely<DB>
    let kyselyEmailVerificationRepository: KyselyEmailVerificationRepository;
    let emailVerificatioCodeGenerator: EmailVericationCodeGenerator;

    beforeEach(async () => {
        if (process.env.DATABASE_URL === undefined)
            throw new Error("Missing environment variable DATABASE_URL");

        db = createDatabase(process.env.DATABASE_URL);
        kyselyEmailVerificationRepository = new KyselyEmailVerificationRepository(db);
        emailVerificatioCodeGenerator = new EmailVericationCodeGenerator();

        await db.deleteFrom("email_verification").execute();
        await db.deleteFrom("users").execute();
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

        const createEmailVerificationUseCase = new CreateEmailVerificationUseCase(
            emailVerificatioCodeGenerator,
            kyselyEmailVerificationRepository
        );

        await expect(createEmailVerificationUseCase.execute(body)).resolves.not.toThrow();

        const emailVerification = await db.selectFrom("users as u")
            .innerJoin("email_verification", (join) => 
                join.onRef("email_verification.user_id", "=", "u.id")
            )
            .select([
                "attempts",
                "email_verification.id as id",
                "user_id",
                "expiresAt",
                "u.email as email",
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

    it("Deve poder atualizar uma verificação de email existente", async () => {
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

        const codeHash = "hashed:code";
        const attempts = 0;

        await db.insertInto("email_verification")
            .values({
                id: crypto.randomUUID(),
                code_hash: codeHash,
                email: body.email,
                expiresAt: new Date(Date.now() + 1000 * 60 * 30),
                user_id: body.userId,
                attempts: attempts,
                verified: false
            })
            .execute();

        const resendEmailVerificationUseCase = new ResendEmailVerificationUseCase(
            kyselyEmailVerificationRepository,
            emailVerificatioCodeGenerator
        );

        await resendEmailVerificationUseCase.execute({ email: body.email });

        const found = await db.selectFrom("email_verification")
            .selectAll()
            .where("email", "=", body.email)
            .executeTakeFirst();

        expect(found).toBeDefined();

        expect(found!.email).toBe(body.email);
        expect(found!.user_id).toBe(body.userId);
        expect(found!.attempts).toBe(attempts);
        expect(found!.code_hash).not.toBe(codeHash);
    });

});