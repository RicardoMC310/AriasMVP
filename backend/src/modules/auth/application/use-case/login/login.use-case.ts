import InvalidUserAttributeException from "../../../../../core/domain/exception/invalid-attributes-user.exception.js";
import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";
import Email from "../../../../../core/domain/vo/email.vo.js";
import AuthCredentialsInvalidException from "../../../domain/exception/credentials-invalid.exception.js";
import AuthLoginRequestDTO from "../../dto/in/login/login-request.dto.js";
import AuthLoginResponseDTO from "../../dto/out/login-response.dto.js";
import IAuthHasher from "../../port/hasher.port.js";
import IAuthTokenGenerator from "../../port/token-generator.port.js";
import IAuthUserFinder from "../../port/user-finder.port.js";

export default class AuthLoginUseCase {

    constructor(
        private readonly userFinder: IAuthUserFinder,
        private readonly authHasher: IAuthHasher,
        private readonly tokenGenerator: IAuthTokenGenerator
    ) {}

    async execute(dto: AuthLoginRequestDTO): Promise<AuthLoginResponseDTO> {
        this.validateInput(dto);
        
        const userFound = await this.userFinder.findUserByEmail(dto.email);

        if (userFound.id === null) {
            throw new InvalidUserAttributeException("id");
        }

        const match = await this.authHasher.verify(userFound.passwordHash, dto.password);
        if (!match) {
            throw new AuthCredentialsInvalidException();
        }

        const token = await this.tokenGenerator.generateToken(userFound.id);

        return {
            token: token
        };
    }

    private validateInput(dto: AuthLoginRequestDTO) {
        Email.isValid(dto.email);
    }

}