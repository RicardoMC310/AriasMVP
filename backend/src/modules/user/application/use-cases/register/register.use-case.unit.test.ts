import { beforeEach, expect, jest, describe, it } from "@jest/globals";
import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";
import UserEntity from "../../../domain/entity/user.entity.js";
import IUserRepository from "../../../domain/repository/user.repository.js";
import InvalidPasswordException from "../../../domain/exception/invalid-password.exception.js";
import IUserHasher from "../../port/hasher.port.js";
import RegisterUserUseCase from "./register.use-case.js";

describe("Testes do caso de uso de registro de usuário", () => {

    let registerUseCase: RegisterUserUseCase;
    let testUserRepository: TestFakeUserRepository;
    let testUserHasher: TestFakeUserHasher;

    beforeEach(() => {
        testUserRepository = new TestFakeUserRepository();
        testUserHasher = new TestFakeUserHasher();
        registerUseCase = new RegisterUserUseCase(testUserRepository, testUserHasher);
    });

    it("Deve registrar um usuário sem erros", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "Rm30042009#"
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
            password: "Rm30042009#"
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

});

class TestFakeUserRepository implements IUserRepository {

    users: UserEntity[] = [];

    async save(userEntity: UserEntity): Promise<void> {
        this.users.push(userEntity);
    }

    findUserByEmail = jest.fn(async () => { return null });

}

class TestFakeUserHasher implements IUserHasher {

    async hash(text: string): Promise<string> {
        return "hashed:" + text;
    }

}