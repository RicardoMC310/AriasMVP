import Email from "../../../../../core/domain/vo/email.vo.js";
import UserEntity from "../../../domain/entity/user.entity.js";
import UserNotFoundException from "../../../domain/exception/user-not-found.exception.js";
import IUserRepository from "../../../domain/repository/user.repository.js";

export default class FindUserByEmailUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async findUserByEmail(email: string): Promise<UserEntity> {
        this.validateInput(email);

        const userFound = await this.userRepository.findUserByEmail(email);

        if(userFound === null)
            throw new UserNotFoundException();

        return userFound;
    }

    private validateInput(email: string) {
        Email.isValid(email);
    }

}