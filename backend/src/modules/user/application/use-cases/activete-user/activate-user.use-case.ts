import UserNotFoundException from "../../../domain/exception/user-not-found.exception.js";
import IUserRepository from "../../../domain/repository/user.repository.js";
import ActivateUserDTO from "../../dto/activate-user/activate-user.dto.js";

export default class ActivateUserUseCase {

    constructor(
        private readonly repository: IUserRepository
    ) {}

    async execute(dto: ActivateUserDTO): Promise<void> {
        const found = await this.repository.findUserById(dto.userId);

        if (found === null)
            throw new UserNotFoundException();

        found.verifyEmail();

        await this.repository.update(found);
    }

}