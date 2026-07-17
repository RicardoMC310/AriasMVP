import { Kysely } from "kysely";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import ArgonUserHasher from "../hasher/argon2.infra.js";
import KyselyUserRepository from "./kysely.infra.js";
import { DB } from "../../../../platform/database/db.js";
import FindUserByEmailUseCase from "../../application/use-cases/find-by-email/find-by-email.use-case.js";
import { beforeEach, describe, expect, it, afterEach } from "@jest/globals";
import { UserState } from "../../domain/entity/user.entity.js";

describe("Teste de integração com kysely com o módulo de usuário", () => {
    let db: Kysely<DB>;
    let kyselyUserRepository: KyselyUserRepository;

    beforeEach(async () => {
        if (process.env.DATABASE_URL === undefined)
            throw new Error("Missing environment variable DATABASE_URL");

        db = createDatabase(process.env.DATABASE_URL);
        kyselyUserRepository = new KyselyUserRepository(db);

        await db.deleteFrom("email_verification").execute();
        await db.deleteFrom("users").execute();
    });

    afterEach(async () => {
        await db.destroy();
    });

    it("Deve salvar o usuário no banco de dados", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "RicardoMC310@"
        };

        const argonHasher = new ArgonUserHasher();
        const registerUseCase = new RegisterUserUseCase(
            kyselyUserRepository, 
            argonHasher
        );

        await expect(registerUseCase.execute(body)).resolves.not.toThrow();

        const user = await db.selectFrom("users").selectAll().executeTakeFirstOrThrow();

        expect(user.name).toBe(body.username);
        expect(user.email).toBe(body.email);
    });

    it("Deve achar usuário por email", async () => {
        const username = "ricardo";
        const email = username + "@gmail.com";
        const passwordHash = "hashed:" + username;

        await db.insertInto("users")
            .values({
                name: username,
                email: email,
                password_hash: passwordHash
            })
            .execute();

        const findUserByEmailUseCase = new FindUserByEmailUseCase(kyselyUserRepository);

        const user = await findUserByEmailUseCase.findUserByEmail(email);

        expect(user!.id).toBeDefined();
        expect(user!.username).toBe(username);
        expect(user!.email).toBe(email);
        expect(user!.passwordHash).toBe(passwordHash);
        expect(user!.state).toBe(UserState.VERIFICATION_PENDING);
    });

})