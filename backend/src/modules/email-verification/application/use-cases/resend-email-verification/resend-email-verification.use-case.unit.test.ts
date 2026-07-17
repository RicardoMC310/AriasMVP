import { describe, it, beforeEach, expect, jest } from "@jest/globals";
import IEmailVerificationRepository from "../../../domain/repository/email-verification.repository.js";
import EmailVerificationEntity from "../../../domain/entities/email-verification.entity.js";
import IEmailVerificationCodeGenerator from "../../port/code-generator.port.js";
import ResendEmailVerificationUseCase from "./resend-email-verification.use-case.js";
import EmailVerificationEntityBuilder from "../../../domain/builder/email-verification.builder.js";

describe("Teste da regra de negócio de reenviar email", () => {
    let repository: TestFakeRepository;
    let codeGenerator: TestFakeCodeGenerator;
    let useCase: ResendEmailVerificationUseCase;

    beforeEach(() => {
        repository = new TestFakeRepository();
        codeGenerator = new TestFakeCodeGenerator();

        repository.injectEntity([
            EmailVerificationEntityBuilder.create()
                .withId(crypto.randomUUID())
                .withAttempts(0)
                .withCodeHash("hashed:Au387663#")
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withUserId(crypto.randomUUID())
                .withVerified(false)
                .build()
        ]);

        useCase = new ResendEmailVerificationUseCase(repository, codeGenerator);
    });

    it("Deve reenviar um email normalmente caso registro já exista", async () => {
        const body = {
            email: "ricardo@gmail.com",
            userId: crypto.randomUUID()
        };

        await useCase.execute(body);

        expect(repository.emails).toHaveLength(1);

        const emailEntity = repository.emails[0];

        expect(emailEntity.attempts).toBe(0);
        expect(emailEntity.codeHash).toBe("hashed:token");
        expect(emailEntity.email).toBe(body.email);
        expect(emailEntity.expiresAt.getTime()).toBeGreaterThan(Date.now());
        expect(emailEntity.verified).toBe(false);
    });

    it("Deve notificar observadores quando o email for reenviado", async () => {
        const observer = {
            execute: jest.fn<(dto: { email: string, token: string }) => Promise<void>>()
        };

        useCase.registerObserver(observer);

        const body = {
            email: "ricardo@gmail.com",
            userId: crypto.randomUUID()
        };

        await useCase.execute(body);

        expect(observer.execute).toHaveBeenCalledTimes(1);
        expect(observer.execute).toHaveBeenCalledWith({
            email: body.email,
            token: "token"
        });

    });

});

class TestFakeCodeGenerator implements IEmailVerificationCodeGenerator {

    shouldFail = false;

    generator(length: number): { token: string; hash: string; } {
        if (this.shouldFail) throw new Error("Code generation failed");

        return {
            token: "token",
            hash: "hashed:token"
        };
    }

    verify = jest.fn<(hash: string, text: string) => boolean>();

}

class TestFakeRepository implements IEmailVerificationRepository {

    emails: EmailVerificationEntity[] = [];
    shouldFailSave = false;

    save = jest.fn<(emailVerificationEntity: EmailVerificationEntity) => Promise<void>>();

    injectEntity(entities: EmailVerificationEntity[]) {
        this.emails = entities;
    }

    async update(emailVerificationEntity: EmailVerificationEntity): Promise<boolean> {
        const index = this.emails.findIndex(email => email.email === emailVerificationEntity.email);

        if (index === -1)
            return false;

        this.emails[index] = emailVerificationEntity;

        return true;
    }

}