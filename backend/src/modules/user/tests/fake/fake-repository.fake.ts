import UserEntity from "../../domain/entity/user.entity.js";
import IUserRepository from "../../domain/repository/user.repository.js";

export default class TestFakeUserRepository implements IUserRepository {

    users: UserEntity[] = [];

    async save(userEntity: UserEntity): Promise<void> {
        this.users.push(userEntity);
    }

    async findUserByEmail(email: string): Promise<UserEntity | null> {
        const index = this.users.findIndex(user => user.email === email);

        if (index === -1)
            return null;

        return this.users[index];
    }

    async findUserById(id: string): Promise<UserEntity | null> {
        const index = this.users.findIndex(user => user.id === id);

        if (index === -1)
            return null;

        return this.users[index];
    }

    async update(userEntity: UserEntity): Promise<void> {
        const index = this.users.findIndex(user => user.id === userEntity.id);

        if (index === -1)
            return;

        this.users[index] = userEntity;
    }

}