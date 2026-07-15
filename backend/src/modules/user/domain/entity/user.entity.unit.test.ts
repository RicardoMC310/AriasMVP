import UserEntityBuilder from "../builder/user-entity.builder.js";

describe("Testes da entidade de usuário", () => {

    it("Deve retornar as propriedades sem modificação", () => {
        const username = "ricardo";
        const email = "ricardo@gmail.com";
        const passwordHash = "hashed:ricardo";

        const userEntity = UserEntityBuilder.create()
            .withUsername(username)
            .withEmail(email)
            .withPasswordHash(passwordHash)
            .build();

        expect(userEntity.id).toBeNull();
        expect(userEntity.email).toBe(email);
        expect(userEntity.username).toBe(username);
        expect(userEntity.passwordHash).toBe(passwordHash);
    });

});