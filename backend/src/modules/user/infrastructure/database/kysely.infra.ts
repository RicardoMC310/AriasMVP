import { Kysely } from "kysely";
import UserEntity, { UserState } from "../../domain/entity/user.entity.js";
import IUserRepository from "../../domain/repository/user.repository.js";
import { DB } from "../../../../platform/database/db.js";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";
import UserEntityBuilder from "../../domain/builder/user-entity.builder.js";

export default class KyselyUserRepository implements IUserRepository {

    constructor(
        private readonly db: Kysely<DB>
    ) {}

    async save(userEntity: UserEntity): Promise<void> {
        await this.db.insertInto("users")
            .values({
                name: userEntity.username,
                email: userEntity.email,
                password_hash: userEntity.passwordHash
            })
            .executeTakeFirst();
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.db.selectFrom("users")
            .selectAll()
            .where("email", "=", email)
            .executeTakeFirst();

        if (user === undefined)
            return null;

        return UserEntityBuilder.create()
            .withId(user.id)
            .withEmail(user.email)
            .withUsername(user.name)
            .withPasswordHash(user.password_hash)
            .withState(user.state as UserState)
            .build();
    }

}