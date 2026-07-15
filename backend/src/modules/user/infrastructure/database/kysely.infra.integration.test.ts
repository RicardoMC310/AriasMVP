import { Kysely } from "kysely";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import ArgonUserHasher from "../hasher/argon2.infra.js";
import KyselyUserRepository from "./kysely.infra.js";
import { DB } from "../../../../platform/database/db.js";

describe("integration test with kysely", () => {
    let db: Kysely<DB>;

    beforeEach(async () => {
        if (process.env.DATABASE_URL === undefined)
            throw new Error("Missing environment variable DATABASE_URL");

        db = createDatabase(process.env.DATABASE_URL);

        await db.deleteFrom("users").execute();
    });

    it("It must save the user to the database", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "RicardoMC310@"
        };

        const kyselyRepository = new KyselyUserRepository(db);
        const argonHasher = new ArgonUserHasher();
        const registerUseCase = new RegisterUserUseCase(kyselyRepository, argonHasher);

        await expect(registerUseCase.execute(body)).resolves.not.toThrow();

        const user = await db.selectFrom("users").selectAll().executeTakeFirstOrThrow();

        expect(user.name).toBe(body.username);
        expect(user.email).toBe(body.email);
    });

})