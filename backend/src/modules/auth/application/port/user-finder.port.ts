import UserEntity from "../../../user/domain/entity/user.entity.js";

export default interface IAuthUserFinder {
    execute(email: string): Promise<UserEntity | null>;
}