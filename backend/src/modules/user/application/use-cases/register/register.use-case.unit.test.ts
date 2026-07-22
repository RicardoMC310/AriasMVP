import { beforeEach, expect, jest, describe, it } from "@jest/globals";
import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";
import InvalidPasswordException from "../../../domain/exception/invalid-password.exception.js";
import RegisterUserUseCase from "./register.use-case.js";
import UserAlreadyRegisteredException from "../../../domain/exception/already-register.exception.js";
import UserEntityBuilder from "../../../domain/builder/user-entity.builder.js";
import TestFakeUserRepository from "../../../tests/fake/fake-repository.fake.js";
import TestFakeUserHasher from "../../../tests/fake/fake-hasher.fake.js";

describe("Testes do caso de uso de registro de usuário", () => {

    let registerUseCase: RegisterUserUseCase;
    let testUserRepository: TestFakeUserRepository;
    let testUserHasher: TestFakeUserHasher;

    beforeEach(() => {
        testUserRepository = new TestFakeUserRepository();
        testUserHasher = new TestFakeUserHasher();
        registerUseCase = new RegisterUserUseCase(
            testUserRepository,
            testUserHasher
        );
    });

    it("Deve registrar um usuário sem erros", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "Au3722437#"
        };

        await expect(registerUseCase.execute(body))
            .resolves
            .not
            .toThrow();

        expect(testUserRepository.users).toHaveLength(1);
        expect(testUserRepository.users[0].username).toBe(body.username);
        expect(testUserRepository.users[0].email).toBe(body.email);
        expect(testUserRepository.users[0].passwordHash).toBe("hashed:" + body.password);
    });

    it("Deve lançar uma exceção se o email for inválido", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo",
            password: "Au3722437#"
        };

        await expect(registerUseCase.execute(body)).rejects.toThrow(InvalidEmailException);

        expect(testUserRepository.users).toHaveLength(0);
    });

    it("Deve lançar uma exceção se a senha for inválida", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmain.com",
            password: "Rm30"
        };

        await expect(registerUseCase.execute(body)).rejects.toThrow(InvalidPasswordException);

        expect(testUserRepository.users).toHaveLength(0);
    });

    it("Deve lançar uma exceção se o email já estiver registrado", async () => {
        testUserRepository.save(
            UserEntityBuilder.create()
                .withId("101010")
                .withEmail("ricardo@gmail.com")
                .withUsername("ricardo")
                .withPasswordHash("hashed:12345678")
                .build()
        );

        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "Au3722437#"
        };

        await expect(registerUseCase.execute(body)).rejects.toThrow(UserAlreadyRegisteredException);

        expect(testUserRepository.users).toHaveLength(1);
    });

    it("Deve notificar os observers ao registrar usuário", async () => {
        const observer = {
            execute: jest.fn<(dto: { email: string, userId: string }) => Promise<void>>()
        };

        registerUseCase.registerObserver(observer);

        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "Au3722437#"
        };

        await registerUseCase.execute(body);

        expect(observer.execute).toHaveBeenCalledTimes(1);
        expect(observer.execute).toHaveBeenCalledWith({
            email: body.email,
            userId: testUserRepository.users[0]!.id
        });
    });

});
