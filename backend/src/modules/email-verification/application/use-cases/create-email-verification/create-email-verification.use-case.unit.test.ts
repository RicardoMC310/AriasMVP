import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import IEmailVerificationCodeGenerator from "../../port/code-generator.port.js";
import IEmailVerificationRepository from "../../../domain/repository/email-verification.repository.js";
import EmailVerificationEntity from "../../../domain/entities/email-verification.entity.js";
import CreateEmailVerificationUseCase from "./create-email-verification.use-case.js";

describe("Teste do caso de uso de criar email de verificação", () => {
    let codeGenerator: TestFakeCodeGenerator;
    let repository: TestFakeRepository;
    let useCase: CreateEmailVerificationUseCase;

    beforeEach(() => {
        codeGenerator = new TestFakeCodeGenerator();
        repository = new TestFakeRepository();
        useCase = new CreateEmailVerificationUseCase(codeGenerator, repository);
    });

    it("Deve criar um email de verificação", async () => {
        const email = "ricardo@gmail.com";
        const userId = "<UUID>";

        await useCase.execute({ email, userId });

        expect(repository.emails).toHaveLength(1);

        const emailEntity = repository.emails[0];

        expect(emailEntity.email).toBe(email);
        expect(emailEntity.userId).toBe(userId);
    });

});

class TestFakeCodeGenerator implements IEmailVerificationCodeGenerator {

    generator(length: number): { token: string; hash: string; } {
        return {
            token: "token",
            hash: "hashed:token"
        };
    }

    verify = jest.fn<(hash: string, text: string) => boolean>();

}

class TestFakeRepository implements IEmailVerificationRepository {

    emails: EmailVerificationEntity[] = [];

    async save(emailVerificationEntity: EmailVerificationEntity): Promise<void> {
        this.emails.push(emailVerificationEntity);
    }

}