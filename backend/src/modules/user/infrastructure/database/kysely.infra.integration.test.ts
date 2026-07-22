import { Kysely } from "kysely";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import ArgonUserHasher from "../hasher/argon2.infra.js";
import KyselyUserRepository from "./kysely.infra.js";
import { DB } from "../../../../platform/database/db.js";
import FindUserByEmailUseCase from "../../application/use-cases/find-by-email/find-by-email.use-case.js";
import { beforeEach, describe, expect, it, afterEach } from "@jest/globals";
import { UserState } from "../../domain/entity/user.entity.js";
import UserEntityBuilder from "../../domain/builder/user-entity.builder.js";

describe("Teste de integração com kysely com o módulo de usuário", () => {
    let db: Kysely<DB>;
    let kyselyUserRepository: KyselyUserRepository;
    let username: string;
    let email: string;
    let passwordHash: string;
    let userId: string;

    beforeEach(async () => {
        if (process.env.DATABASE_URL === undefined)
            throw new Error("Missing environment variable DATABASE_URL");

        db = createDatabase(process.env.DATABASE_URL);
        kyselyUserRepository = new KyselyUserRepository(db);

        await db.deleteFrom("email_verification").execute();
        await db.deleteFrom("users").execute();

        username = "ricardo";
        email = username + "@gmail.com";
        passwordHash = "hashed:" + username;
        userId = crypto.randomUUID();

        await db.insertInto("users")
            .values({
                id: userId,
                name: username,
                email: email,
                password_hash: passwordHash
            })
            .execute();

    });

    afterEach(async () => {
        await db.destroy();
    });

    it("Deve salvar o usuário no banco de dados", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo2@gmail.com",
            password: "RicardoMC310@"
        };

        const argonHasher = new ArgonUserHasher();
        const registerUseCase = new RegisterUserUseCase(
            kyselyUserRepository,
            argonHasher
        );

        await expect(registerUseCase.execute(body)).resolves.not.toThrow();

        const user = await db.selectFrom("users")
            .selectAll()
            .where("email", "=", body.email)
            .executeTakeFirstOrThrow();

        expect(user.name).toBe(body.username);
        expect(user.email).toBe(body.email);
    });

    it("Deve achar usuário por email", async () => {


        const findUserByEmailUseCase = new FindUserByEmailUseCase(kyselyUserRepository);

        const user = await findUserByEmailUseCase.execute(email);

        expect(user!.id).toBeDefined();
        expect(user!.username).toBe(username);
        expect(user!.email).toBe(email);
        expect(user!.passwordHash).toBe(passwordHash);
        expect(user!.state).toBe(UserState.VERIFICATION_PENDING);
    });

    it("Deve encontrar um usuário pelo id", async () => {
        const user = await kyselyUserRepository.findUserById(userId);

        expect(user).not.toBeNull();
        expect(user!.id).toBe(userId);
    });

    it("Deve atualizar um registro no banco", async () => {
        const userEntity = UserEntityBuilder.create()
            .withId(userId)
            .withEmail("ricardo@gmail.com")
            .withPasswordHash("hashed:12345678")
            .withUsername("Ricardo M. Costa")
            .withState(UserState.BLOCKED)
            .build();

        await kyselyUserRepository.update(userEntity);

        const found = await kyselyUserRepository.findUserById(userId);

        expect(found).not.toBeNull();
        expect(found!.id).toBe(userId);
        expect(found!.username).toBe("Ricardo M. Costa");
        expect(found!.email).toBe("ricardo@gmail.com");
        expect(found!.passwordHash).toBe("hashed:12345678");
        expect(found!.state).toBe(UserState.BLOCKED);
    });

})