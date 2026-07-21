import { describe, beforeEach, afterEach, it, expect, jest } from "@jest/globals";
import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import KyselyEmailVerificationRepository from "./kysely.infra.js";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";
import CreateEmailVerificationUseCase from "../../application/use-cases/create-email-verification/create-email-verification.use-case.js";
import EmailVericationCodeGenerator from "../code/code-generator.infra.js";
import ResendEmailVerificationUseCase from "../../application/use-cases/resend-email-verification/resend-email-verification.use-case.js";
import EmailVerificationEntityBuilder from "../../domain/builder/email-verification.builder.js";

describe("Teste de integração com kysely com o módulo de verificação de email", () => {
    let db: Kysely<DB>
    let kyselyEmailVerificationRepository: KyselyEmailVerificationRepository;
    let userId: string;
    let email: string;

    beforeEach(async () => {
        if (process.env.DATABASE_URL === undefined)
            throw new Error("Missing environment variable DATABASE_URL");

        db = createDatabase(process.env.DATABASE_URL);
        kyselyEmailVerificationRepository = new KyselyEmailVerificationRepository(db);

        userId = crypto.randomUUID();
        email = "ricardo@gmail.com";

        await db.deleteFrom("email_verification").execute();
        await db.deleteFrom("users").execute();

        await db.insertInto("users")
            .values({
                id: userId,
                email: email,
                name: "ricardo",
                password_hash: "hashed:12345678",
                state: "VERIFICATION_PENDING"
            })
            .execute();
    });

    afterEach(async () => {
        await db.destroy();
    });

    it("Deve poder registrar uma nova verificação de email", async () => {
        await kyselyEmailVerificationRepository.save(
            EmailVerificationEntityBuilder.create()
                .withId(crypto.randomUUID())
                .withAttempts(0)
                .withCodeHash("hashed:token")
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withUserId(userId)
                .withVerified(false)
                .build()
        );

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
        expect(emailVerification!.email).toBe(email);
        expect(emailVerification!.user_id).toBe(userId);
        expect(emailVerification!.attempts).toBe(0);
        expect(emailVerification!.verified).toBe(false);
        expect(emailVerification!.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });

    it("Deve poder atualizar uma verificação de email existente", async () => {
        const entity = EmailVerificationEntityBuilder.create()
                .withId(crypto.randomUUID())
                .withAttempts(0)
                .withCodeHash("hashed:token")
                .withEmail(email)
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withUserId(userId)
                .withVerified(false)
                .build()

        await kyselyEmailVerificationRepository.save(entity);

        entity.incrementAttempts();
        
        await kyselyEmailVerificationRepository.update(entity);

        const found = await db.selectFrom("email_verification")
            .selectAll()
            .where("email", "=", email)
            .executeTakeFirst();

        expect(found).toBeDefined();

        expect(found!.email).toBe(email);
        expect(found!.user_id).toBe(userId);
        expect(found!.attempts).toBe(1);
        expect(found!.code_hash).toBe("hashed:token");
    });

    it("Deve encontrar uma verificação pelo email", async () => {
        const found = await kyselyEmailVerificationRepository.findByEmail(email);

        expect(found).toBeDefined();
    });

});