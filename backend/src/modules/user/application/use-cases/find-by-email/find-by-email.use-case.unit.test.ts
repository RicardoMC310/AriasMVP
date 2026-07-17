import UserEntityBuilder from "../../../domain/builder/user-entity.builder.js";
import UserEntity from "../../../domain/entity/user.entity.js";
import IUserRepository from "../../../domain/repository/user.repository.js";
import FindUserByEmailUseCase from "./find-by-email.use-case.js";
import { beforeEach, describe, expect, it } from "@jest/globals";

describe("Teste do caso de uso de procurar usuário por email", () => {
    let userRepository: TestFakeUserRepository;
    let useCase: FindUserByEmailUseCase;

    beforeEach(async () => {
        userRepository = new TestFakeUserRepository();

        await userRepository.save(UserEntityBuilder.create()
            .withId("101010")
            .withUsername("ricardo")
            .withEmail("ricardo@gmail.com")
            .withPasswordHash("hashed:12345678")
            .build());

        useCase = new FindUserByEmailUseCase(userRepository);
    });

    it("Deve retornar usuário pelo email", async () => {
        const email = "ricardo@gmail.com";

        const user = await useCase.findUserByEmail(email);

        expect(user).toBeDefined();
    });

    it("Deve retornar null para usuário não encontrado", async () => {
        const email = "ricardo1@gmail.com";

        const user = await useCase.findUserByEmail(email);

        expect(user).toBeNull();
    });

});

class TestFakeUserRepository implements IUserRepository {

    users: UserEntity[] = [];

    async save(userEntity: UserEntity): Promise<void> {
        this.users.push(userEntity);
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        const found = this.users.find(user => user.email === email);

        if (found === undefined)
            return null;

        return found;
    }

}