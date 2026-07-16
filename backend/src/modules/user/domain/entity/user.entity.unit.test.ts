import UserEntityBuilder from "../builder/user-entity.builder.js";
import { describe, expect, it } from "@jest/globals";
import { UserState } from "./user.entity.js";
import UserCannotTransitionStateException from "../exception/cannot-transition-state.exception.js";

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
            .withId("101010")
            .build();

        expect(userEntity.id).toBeDefined();
        expect(userEntity.email).toBe(email);
        expect(userEntity.username).toBe(username);
        expect(userEntity.passwordHash).toBe(passwordHash);
        expect(userEntity.state).toBe(UserState.ACTIVE);
    });

    it("Deve permitir transição de não verificado para verificado", () => {
        const userEntity = UserEntityBuilder.create()
            .withState(UserState.VERIFICATION_PENDING)
            .withEmail("ricardo@gmal.com")
            .withUsername("Ricardo")
            .build();

        userEntity.verifyEmail();

        expect(userEntity.state).toBe(UserState.ACTIVE);
    });

    it("Deve bloquear tentar verificar usuário já verificado", () => {
        const userEntity = UserEntityBuilder.create()
            .withState(UserState.ACTIVE)
            .withEmail("ricardo@gmal.com")
            .withUsername("Ricardo")
            .build();

        expect(() => userEntity.verifyEmail()).toThrow(UserCannotTransitionStateException);

        expect(userEntity.state).toBe(UserState.ACTIVE);
    });

    it("Deve bloquear usuário bloqueado de verificar", () => {
        const userEntity = UserEntityBuilder.create()
            .withState(UserState.BLOCKED)
            .withEmail("ricardo@gmal.com")
            .withUsername("Ricardo")
            .build();

        expect(() => userEntity.verifyEmail()).toThrow(UserCannotTransitionStateException);

        expect(userEntity.state).toBe(UserState.BLOCKED);
    })

    it("Deve permitir transição de não verificado para bloqueado", () => {
        const userEntity = UserEntityBuilder.create()
            .withState(UserState.VERIFICATION_PENDING)
            .withEmail("ricardo@gmal.com")
            .withUsername("Ricardo")
            .build();

        userEntity.block();

        expect(userEntity.state).toBe(UserState.BLOCKED);
    });

    it("Deve permitir transição de ativo para bloqueado", () => {
        const userEntity = UserEntityBuilder.create()
            .withState(UserState.ACTIVE)
            .withEmail("ricardo@gmal.com")
            .withUsername("Ricardo")
            .build();

        userEntity.block();

        expect(userEntity.state).toBe(UserState.BLOCKED);
    });

});