import UserEntityBuilder from "../builder/user-entity.builder.js";
import { describe, expect, it } from "@jest/globals";
import { UserState } from "./user.entity.js";

describe("Testes da entidade de usuário", () => {

    it("Deve retornar as propriedades sem modificação", () => {
        const username = "ricardo";
        const email = "ricardo@gmail.com";
        const passwordHash = "hashed:ricardo";

        const userEntity = UserEntityBuilder.create()
            .withUsername(username)
            .withEmail(email)
            .withPasswordHash(passwordHash)
            .withState(UserState.ACTIVE)
            .build();

        expect(userEntity.id).toBeNull();
        expect(userEntity.email).toBe(email);
        expect(userEntity.username).toBe(username);
        expect(userEntity.passwordHash).toBe(passwordHash);
        expect(userEntity.state).toBe(UserState.ACTIVE);
    });

});