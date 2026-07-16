import UserEntity from "../entity/user.entity.js";

export default interface IUserRepository {
    save(userEntity: UserEntity): Promise<void>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
}