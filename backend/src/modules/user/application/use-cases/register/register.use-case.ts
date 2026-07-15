import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";
import UserEntityBuilder from "../../../domain/builder/user-entity.builder.js";
import IUserRepository from "../../../domain/repository/user.repository.js";
import InvalidPasswordException from "../../exception/invalid-password.exception.js";
import RegisterUserDTO from "../dto/register/register.dto.js";
import IUserHasher from "../port/hasher.port.js";

export default class RegisterUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userHasher: IUserHasher
    ) {}

    async execute(dto: RegisterUserDTO): Promise<void> {
        this.validateInput(dto);

        const passwordHash = await this.userHasher.hash(dto.password);

        const userEntity = UserEntityBuilder.create()
            .withUsername(dto.username)
            .withEmail(dto.email)
            .withPasswordHash(passwordHash)
            .build();

        await this.userRepository.save(userEntity);
    }

    private validateInput(dto: RegisterUserDTO) {
        if (!dto.email.includes("@")) 
            throw new InvalidEmailException(dto.email);

        const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

        if (!regex.test(dto.password))
            throw new InvalidPasswordException();
    }

}