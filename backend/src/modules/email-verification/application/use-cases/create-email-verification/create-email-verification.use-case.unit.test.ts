import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import CreateEmailVerificationUseCase from "./create-email-verification.use-case.js";
import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";
import TestFakeEmailVerificationRepository from "../../../tests/fakes/fake-email-verification-repository.fake.js";
import TestFakeEmailVerificationCodeGenerator from "../../../tests/fakes/fake-code-generator.fake.js";

describe("Teste do caso de uso de criar email de verificação", () => {
    let codeGenerator: TestFakeEmailVerificationCodeGenerator;
    let repository: TestFakeEmailVerificationRepository;
    let useCase: CreateEmailVerificationUseCase;

    beforeEach(() => {
        codeGenerator = new TestFakeEmailVerificationCodeGenerator();
        repository = new TestFakeEmailVerificationRepository();
        useCase = new CreateEmailVerificationUseCase(codeGenerator, repository);
    });

    it("Deve criar um email de verificação com todos os campos corretos", async () => {
        const email = "ricardo@gmail.com";
        const userId = "<UUID>";

        await useCase.execute({ email, userId });

        expect(repository.emails).toHaveLength(1);

        const emailEntity = repository.emails[0];

        expect(emailEntity.email).toBe(email);
        expect(emailEntity.userId).toBe(userId);
        expect(emailEntity.codeHash.length).toBeGreaterThanOrEqual(8);
        expect(emailEntity.verified).toBe(false);
        expect(emailEntity.attempts).toBe(0);
        expect(emailEntity.expiresAt.getTime()).toBeGreaterThan(Date.now());
        expect(emailEntity.id).toBeDefined();
    });

    it("Deve chamar os observers ao criar email de verificação", async () => {
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

    it("Deve lançar exceção se o email for inválido", async () => {
        const email = "email-invalido";
        const userId = "<UUID>";

        await expect(useCase.execute({ email, userId })).rejects.toThrow(InvalidEmailException);

        expect(repository.emails).toHaveLength(0);
    });

    it("Deve lançar exceção se o repositório falhar ao salvar", async () => {
        repository.shouldFail = true;

        const email = "ricardo@gmail.com";
        const userId = "<UUID>";

        await expect(useCase.execute({ email, userId })).rejects.toThrow("Repository save failed");
    });

    it("Deve propagar exceção se o gerador de código falhar", async () => {
        codeGenerator.shouldFail = true;

        const email = "ricardo@gmail.com";
        const userId = "<UUID>";

        await expect(useCase.execute({ email, userId })).rejects.toThrow("Code generation failed");
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