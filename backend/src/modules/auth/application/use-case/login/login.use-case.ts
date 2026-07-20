import Email from "../../../../../core/domain/vo/email.vo.js";
import UserNotFoundException from "../../../../user/domain/exception/user-not-found.exception.js";
import LoginPolicy from "../../../domain/policies/login.policy.js";
import UserActiveSpecification from "../../../domain/specifications/user-verified.specification.js";
import AuthCredentialsInvalidException from "../../../domain/exception/credentials-invalid.exception.js";
import AuthLoginRequestDTO from "../../dto/in/login/login-request.dto.js";
import IAuthHasher from "../../port/hasher.port.js";
import IAuthTokenGenerator from "../../port/token-generator.port.js";
import IAuthUserFinder from "../../port/user-finder.port.js";
import UserNotVerifiedException from "../../../domain/exception/user-not-verified.exception.js";
import UserEntity from "../../../../user/domain/entity/user.entity.js";
import AuthLoginResponseDTO from "../../dto/out/login/login-response.dto.js";

export default class AuthLoginUseCase {

    constructor(
        private readonly userFinder: IAuthUserFinder,
        private readonly authHasher: IAuthHasher,
        private readonly tokenGenerator: IAuthTokenGenerator
    ) { }

    async execute(dto: AuthLoginRequestDTO): Promise<AuthLoginResponseDTO> {
        this.validateInput(dto);

        const userFound = await this.findUser(dto.email);
        this.canLogin(userFound);
        await this.credentialValid(userFound, dto.password);

        const token = await this.tokenGenerator.generateToken(userFound.id!);

        return {
            token: token
        };
    }

    private validateInput(dto: AuthLoginRequestDTO) {
        Email.ensureValid(dto.email);
    }

    private async findUser(email: string): Promise<UserEntity> {
        const userFound = await this.userFinder.execute(email);

        if (userFound === null)
            throw new UserNotFoundException();

        return userFound;
    }

    private canLogin(userFound: UserEntity) {
        const loginPolicy = new LoginPolicy(new UserActiveSpecification());

        if (!loginPolicy.can(userFound))
            throw new UserNotVerifiedException();

    }

    private async credentialValid(userFound: UserEntity, password: string) {
        const match = await this.authHasher.verify(userFound.passwordHash, password);
        if (!match) {
            throw new AuthCredentialsInvalidException();
        }
    }
}