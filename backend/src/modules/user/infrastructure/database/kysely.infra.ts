import { Kysely } from "kysely";
import UserEntity from "../../domain/entity/user.entity.js";
import IUserRepository from "../../domain/repository/user.repository.js";
import { DB } from "../../../../platform/database/db.js";
import { createDatabase } from "../../../../platform/database/kysely.connection.js";

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

}