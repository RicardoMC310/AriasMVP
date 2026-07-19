import { describe, it, beforeEach, expect, jest, afterEach } from "@jest/globals";
import ResendEmailVerificationUseCase from "./resend-email-verification.use-case.js";
import EmailVerificationEntityBuilder from "../../../domain/builder/email-verification.builder.js";
import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";
import TestFakeEmailVerificationRepository from "../../../tests/fakes/fake-email-verification-repository.fake.js";
import TestFakeEmailVerificationCodeGenerator from "../../../tests/fakes/fake-code-generator.fake.js";

describe("Teste da regra de negócio de reenviar email", () => {
    let repository: TestFakeEmailVerificationRepository;
    let codeGenerator: TestFakeEmailVerificationCodeGenerator;
    let useCase: ResendEmailVerificationUseCase;

    beforeEach(() => {
        repository = new TestFakeEmailVerificationRepository();
        codeGenerator = new TestFakeEmailVerificationCodeGenerator();

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

    afterEach(() => {
        repository.emails = [];
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
        expect(emailEntity.codeHash.length).toBeGreaterThanOrEqual(8);
        expect(emailEntity.email).toBe(body.email);
        expect(emailEntity.expiresAt.getTime()).toBeGreaterThan(Date.now());
        expect(emailEntity.verified).toBe(false);
    });

    it("Deve notificar observadores quando o email for reenviado", async () => {
        let code: string;

        const observer = {
            execute: jest.fn<(dto: { email: string, token: string }) => Promise<void>>(async (dto: { email: string, token: string }) => {
                code = dto.token;
            })
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
            token: code!
        });

    });

    it("Deve falhar se email inválido for passado", async () => {
        const body = {
            email: "ricardo",
            userId: crypto.randomUUID()
        };

        await expect(useCase.execute(body)).rejects.toThrow(InvalidEmailException);

        expect(repository.emails).toHaveLength(1);
    });

    it("Deve falhar se o gerador de código falhar", async () => {
        const body = {
            email: "ricardo",
            userId: crypto.randomUUID()
        };

        codeGenerator.shouldFail = true;

        await expect(useCase.execute(body)).rejects.toThrow();

        expect(repository.emails).toHaveLength(1);
    });

    it("Deve falhar se o repository falhar", async () => {
        const body = {
            email: "ricardo",
            userId: crypto.randomUUID()
        };

        repository.shouldFail = true;

        await expect(useCase.execute(body)).rejects.toThrow();

        expect(repository.emails).toHaveLength(1);
    });

    it("Deve gerar exatamente um código de 8 dígitos", async () => {
        const body = {
            email: "ricardo@gmail.com",
            userId: crypto.randomUUID()
        };

        await useCase.execute(body);

        expect(repository.emails).toHaveLength(1);

        expect(repository.emails[0]!.codeHash).toHaveLength(8 + ("hashed:".length));
    });

});