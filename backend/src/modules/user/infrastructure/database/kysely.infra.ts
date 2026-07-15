import db from "../../../../platform/database/postgres.connection.js";
import UserEntity from "../../domain/entity/user.entity.js";
import IUserRepository from "../../domain/repository/user.repository.js";

export default class KyselyUserRepository implements IUserRepository {

    async save(userEntity: UserEntity): Promise<void> {
        await db.insertInto("users")
            .values({
                name: userEntity.username,
                email: userEntity.email,
                password_hash: userEntity.passwordHash
            })
            .executeTakeFirst();
    }

}