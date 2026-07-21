import { describe, jest, beforeEach, it, expect  } from "@jest/globals";
import TestFakeEmailVerificationRepository from "../../../tests/fakes/fake-email-verification-repository.fake.js";
import TestFakeEmailVerificationCodeGenerator from "../../../tests/fakes/fake-code-generator.fake.js";
import VerifyEmailVerificationUseCase from "./verify-email-verification.use-case.js";
import EmailVerificationEntityBuilder from "../../../domain/builder/email-verification.builder.js";

describe("Testes do caso de uso de verificar email", () => {
    let repository: TestFakeEmailVerificationRepository;
    let codeGenerator: TestFakeEmailVerificationCodeGenerator;
    let useCase: VerifyEmailVerificationUseCase;

    beforeEach(() => {
        codeGenerator = new TestFakeEmailVerificationCodeGenerator();
        repository = new TestFakeEmailVerificationRepository();

        useCase = new VerifyEmailVerificationUseCase(
            codeGenerator,
            repository
        )
    });

    it("Deve atualizar o estado de verificado no banco de dados", async () => {
        const { token, hash } = codeGenerator.generator(8);

        const body = {
            email: "ricardo@gmail.com",
            token: token
        };

        repository.injectEntity([
            EmailVerificationEntityBuilder.create()
                .withAttempts(0)
                .withCodeHash(hash)
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withId("101011")
                .withUserId("101010")
                .withVerified(false)
                .build()
        ])

        await useCase.execute(body);

        expect(repository.emails[0]!.verified).toBe(true);
    });

    it("Deve aumentar a quantidade de tentativas caso o código não bata", async () => {
        const { token, hash } = codeGenerator.generator(8);

        const body = {
            email: "ricardo@gmail.com",
            token: token.replace(/[a-zA-Z0-9]/, "1")
        };

        repository.injectEntity([
            EmailVerificationEntityBuilder.create()
                .withAttempts(0)
                .withCodeHash(hash)
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withId("101011")
                .withUserId("101010")
                .withVerified(false)
                .build()
        ])

        await expect(useCase.execute(body)).rejects.toThrow();

        expect(repository.emails[0]!.verified).toBe(false);
        expect(repository.emails[0].attempts).toBe(1);
    });

    it("Deve falar caso verificação já esteja expirada", async () => {
        const { token, hash } = codeGenerator.generator(8);

        const body = {
            email: "ricardo@gmail.com",
            token: token
        };

        repository.injectEntity([
            EmailVerificationEntityBuilder.create()
                .withAttempts(0)
                .withCodeHash(hash)
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() - 1000 * 60 * 60))
                .withId("101011")
                .withUserId("101010")
                .withVerified(false)
                .build()
        ])

        await expect(useCase.execute(body)).rejects.toThrow();

        expect(repository.emails[0]!.verified).toBe(false);
        expect(repository.emails[0]!.attempts).toBe(0);
    });

    it("Deve falhar se passado um email inválido", async () => {
        const { token, hash } = codeGenerator.generator(8);

        const body = {
            email: "ricardo",
            token: token
        };

        repository.injectEntity([
            EmailVerificationEntityBuilder.create()
                .withAttempts(0)
                .withCodeHash(hash)
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withId("101011")
                .withUserId("101010")
                .withVerified(false)
                .build()
        ])

        await expect(useCase.execute(body)).rejects.toThrow();

        expect(repository.emails[0]!.verified).toBe(false);
    });

    it("Deve falhar se passado um token inválido", async () => {
        const { token, hash } = codeGenerator.generator(8);

        const body = {
            email: "ricardo@gmail.com",
            token: "tok"
        };

        repository.injectEntity([
            EmailVerificationEntityBuilder.create()
                .withAttempts(0)
                .withCodeHash(hash)
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withId("101011")
                .withUserId("101010")
                .withVerified(false)
                .build()
        ])

        await expect(useCase.execute(body)).rejects.toThrow();

        expect(repository.emails[0]!.verified).toBe(false);
    });

    it("Deve falhar se a verificação já foi utilizada", async () => {
        const body = {
            email: "ricardo@gmail.com",
            token: "token"
        }

        repository.injectEntity([
            EmailVerificationEntityBuilder.create()
                .withId("101010")
                .withAttempts(0)
                .withCodeHash("hashed:token")
                .withEmail("ricardo@gmail.com")
                .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
                .withUserId("101011")
                .withVerified(true)
                .build()
        ]);

        await expect(useCase.execute(body)).rejects.toThrow();

        expect(repository.emails[0]!.verified).toBe(true);
    })

});