import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import IEmailVerificationCodeGenerator from "../../port/code-generator.port.js";
import IEmailVerificationRepository from "../../../domain/repository/email-verification.repository.js";
import EmailVerificationEntity from "../../../domain/entities/email-verification.entity.js";
import CreateEmailVerificationUseCase from "./create-email-verification.use-case.js";
import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";

describe("Teste do caso de uso de criar email de verificação", () => {
    let codeGenerator: TestFakeCodeGenerator;
    let repository: TestFakeRepository;
    let useCase: CreateEmailVerificationUseCase;

    beforeEach(() => {
        codeGenerator = new TestFakeCodeGenerator();
        repository = new TestFakeRepository();
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
        expect(emailEntity.codeHash).toBe("hashed:token");
        expect(emailEntity.verified).toBe(false);
        expect(emailEntity.attempts).toBe(0);
        expect(emailEntity.expiresAt.getTime()).toBeGreaterThan(Date.now());
        expect(emailEntity.id).toBeDefined();
    });

    it("Deve lançar exceção se o email for inválido", async () => {
        const email = "email-invalido";
        const userId = "<UUID>";

        await expect(useCase.execute({ email, userId })).rejects.toThrow(InvalidEmailException);

        expect(repository.emails).toHaveLength(0);
    });

    it("Deve lançar exceção se o repositório falhar ao salvar", async () => {
        repository.shouldFailSave = true;

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

}

class TestFakeRepository implements IEmailVerificationRepository {

    emails: EmailVerificationEntity[] = [];
    shouldFailSave = false;

    async save(emailVerificationEntity: EmailVerificationEntity): Promise<void> {
        if (this.shouldFailSave) throw new Error("Repository save failed");

        this.emails.push(emailVerificationEntity);
    }

}