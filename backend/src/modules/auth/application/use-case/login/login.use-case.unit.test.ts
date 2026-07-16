import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import IAuthUserFinder from "../../port/user-finder.port.js";
import UserEntity from "../../../../user/domain/entity/user.entity.js";
import UserEntityBuilder from "../../../../user/domain/builder/user-entity.builder.js";
import IAuthHasher from "../../port/hasher.port.js";
import IAuthTokenGenerator from "../../port/token-generator.port.js";
import AuthLoginUseCase from "./login.use-case.js";
import UserNotFoundException from "../../../../user/domain/exception/user-not-found.exception.js";
import AuthCredentialsInvalidException from "../../../domain/exception/credentials-invalid.exception.js";

describe("Teste do caso de uso de login", () => {
    let authUserFinder: TestFakeAuthUserFinder;
    let authHasher: TestFakeAuthHasher;
    let authTokenGenerator: TestFakeAuthTokenGenerator
    let useCase: AuthLoginUseCase

    beforeEach(() => {
        authUserFinder = new TestFakeAuthUserFinder();
        authHasher = new TestFakeAuthHasher();
        authTokenGenerator = new TestFakeAuthTokenGenerator();

        useCase = new AuthLoginUseCase(authUserFinder, authHasher, authTokenGenerator);
    });

    it("Deve retornar um token os dados entiverem corretos", async () => {
        let body = {
            email: "ricardo@gmail.com",
            password: "12345678"
        };

        const { token } = await useCase.execute(body);

        expect(token).toBe("token:101010")
    });

    it("Deve lançar um erro se usuário não for encontrado", async () => {
        const body = {
            email: "ricardo12@gmail.com",
            password: "12345678"
        };

        await expect(useCase.execute(body)).rejects.toThrow(UserNotFoundException);
    });

    it("Deve lançar um erro se as credenciais estiverem inválidas", async () => {
        const body = {
            email: "ricardo@gmail.com",
            password: "123456789"
        };

        await expect(useCase.execute(body)).rejects.toThrow(AuthCredentialsInvalidException);
    });

});

class TestFakeAuthUserFinder implements IAuthUserFinder {

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        if (email !== "ricardo@gmail.com")
            return null;

        return UserEntityBuilder.create()
            .withId("101010")
            .withEmail("ricardo@gmail.com")
            .withPasswordHash("hashed:12345678")
            .withUsername("ricardo")
            .build();
    }

}

class TestFakeAuthHasher implements IAuthHasher {

    async verify(hash: string, text: string): Promise<boolean> {
        return hash === ("hashed:" + text);
    }

}

class TestFakeAuthTokenGenerator implements IAuthTokenGenerator {

    async generateToken(id: string): Promise<string> {
        return "token:" + id;
    }

}