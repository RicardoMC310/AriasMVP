import { v7 as uuidv7 } from "uuid";
import UserEntityBuilder from "../../../domain/builder/user-entity.builder.js";
import IUserRepository from "../../../domain/repository/user.repository.js";
import InvalidPasswordException from "../../../domain/exception/invalid-password.exception.js";
import RegisterUserDTO from "../../dto/register/register.dto.js";
import IUserHasher from "../../port/hasher.port.js";
import Email from "../../../../../core/domain/vo/email.vo.js";
import UserAlreadyRegisteredException from "../../../domain/exception/already-register.exception.js";
import IUserCreateEmailVerificationUseCase from "../../port/create-email-verification.port.js";
import UserRegisterObserver from "../../port/types/user-observer-register.observer.js";

export default class RegisterUserUseCase {

    private observers: UserRegisterObserver[] = [];

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly userHasher: IUserHasher
    ) { }

    async execute(dto: RegisterUserDTO): Promise<void> {
        this.validateInput(dto);

        const userFound = await this.userRepository.findUserByEmail(dto.email);

        if (userFound !== null)
            throw new UserAlreadyRegisteredException();

        const passwordHash = await this.userHasher.hash(dto.password);

        const userEntity = UserEntityBuilder.create()
            .withUsername(dto.username)
            .withEmail(dto.email)
            .withPasswordHash(passwordHash)
            .withId(uuidv7())
            .build();

        await this.userRepository.save(userEntity);

        await this.notifyAll(userEntity.email, userEntity.id);
    }

    public registerObserver(observer: UserRegisterObserver) {
        this.observers.push(observer);
    }

    private validateInput(dto: RegisterUserDTO) {
        Email.ensureValid(dto.email);

        const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;

        if (!regex.test(dto.password))
            throw new InvalidPasswordException();
    }

    private async notifyAll(email: string, userId: string) {
        await Promise.all(this.observers.map(observer => observer.execute({ email, userId })));
    }

}