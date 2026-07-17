import UserEntity from "../../../user/domain/entity/user.entity.js";

export default interface IAuthUserFinder {
    findUserByEmail(email: string): Promise<UserEntity | null>;
}