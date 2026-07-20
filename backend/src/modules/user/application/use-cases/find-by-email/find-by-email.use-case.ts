import Email from "../../../../../core/domain/vo/email.vo.js";
import UserEntity from "../../../domain/entity/user.entity.js";
import IUserRepository from "../../../domain/repository/user.repository.js";

export default class FindUserByEmailUseCase {

    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(email: string): Promise<UserEntity | null> {
        this.validateInput(email);

        const userFound = await this.userRepository.findUserByEmail(email);
        
        return userFound;
    }

    private validateInput(email: string) {
        Email.ensureValid(email);
    }

}