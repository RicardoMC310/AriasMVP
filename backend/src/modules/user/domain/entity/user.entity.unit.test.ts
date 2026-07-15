import UserEntityBuilder from "../builder/user-entity.builder.js";

describe("Tests for the user entity", () => {

    it("It should return the properties without modification", () => {
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