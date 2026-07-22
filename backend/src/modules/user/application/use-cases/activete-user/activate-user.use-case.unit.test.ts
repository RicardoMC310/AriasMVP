import { describe, jest, it, expect, beforeEach } from "@jest/globals";
import TestFakeUserRepository from "../../../tests/fake/fake-repository.fake.js";
import ActivateUserUseCase from "./activate-user.use-case.js";
import UserEntityBuilder from "../../../domain/builder/user-entity.builder.js";
import { UserState } from "../../../domain/entity/user.entity.js";
import UserNotFoundException from "../../../domain/exception/user-not-found.exception.js";

describe("Testes do caso de uso de ativar usuário", () => {
    let repository: TestFakeUserRepository;
    let useCase: ActivateUserUseCase;

    beforeEach(() => {
        repository = new TestFakeUserRepository();

        useCase = new ActivateUserUseCase(repository);
    });

    it("Deve marcar um usuário como ativo", async () => {
        const userId = crypto.randomUUID();

        repository.save(
            UserEntityBuilder.create()
                .withId(userId)
                .withEmail("ricardo@gmail.com")
                .withPasswordHash("hashed:12345678")
                .withUsername("Ricardo")
                .withState(UserState.VERIFICATION_PENDING)
                .build()
        );

        await useCase.execute({ userId });

        const found = await repository.findUserById(userId);

        expect(found).not.toBeNull();
        expect(found!.state).toBe(UserState.ACTIVE);
    });

    it("Deve lançar uma exceção caso usuário não exista", async () => {
       await expect(useCase.execute({ userId: "<User-UUID>" })).rejects.toThrow(UserNotFoundException);

        const found = await repository.findUserById("<User-UUID>");

        expect(found).toBeNull();
    });

});