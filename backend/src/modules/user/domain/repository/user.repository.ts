import UserEntity from "../entity/user.entity.js";

export default interface IUserRepository {
    save(userEntity: UserEntity): Promise<void>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
    findUserById(id: string): Promise<UserEntity | null>;
    update(userEntity: UserEntity): Promise<void>;
}