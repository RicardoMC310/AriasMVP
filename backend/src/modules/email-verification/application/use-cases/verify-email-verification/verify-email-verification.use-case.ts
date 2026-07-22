import Email from "../../../../../core/domain/vo/email.vo.js";
import EmailVerificationNotExistsException from "../../../domain/exception/email-verification-not-exists.exception.js";
import InvalidEmailVerificationTokenException from "../../../domain/exception/invalid-token-email-verification.expection.js";
import InvalidTokenFormatException from "../../../domain/exception/token-format-invalid.exception.js";
import IEmailVerificationRepository from "../../../domain/repository/email-verification.repository.js";
import VerifyEmailVerificationRequestDTO from "../../dto/in/verify-email-verifcation/verify-email-verification.dto.js";
import IEmailVerificationCodeGenerator from "../../port/code-generator.port.js";
import IEmailVerificationVerifyObserver from "../../port/observers/email-verification-verify-observer.port.js";

export default class VerifyEmailVerificationUseCase {

    constructor(
        private readonly codeGenerator: IEmailVerificationCodeGenerator,
        private readonly repository: IEmailVerificationRepository
    ) {}

    private readonly observers: IEmailVerificationVerifyObserver[] = [];

    async execute(dto: VerifyEmailVerificationRequestDTO): Promise<void> {
        this.validate(dto);

        const found = await this.repository.findByEmail(dto.email);

        if (found === null)
            throw new EmailVerificationNotExistsException(dto.email);

        found.ensureNotExpired();

        const match = this.codeGenerator.verify(found.codeHash, dto.token);
        if (!match) {
            found.incrementAttempts();
            await this.repository.update(found);
            throw new InvalidEmailVerificationTokenException();
        }

        found.verify();
        await this.repository.update(found);

        await this.notifyAll(found.userId);
    }

    registerObserver(observer: IEmailVerificationVerifyObserver) {
        this.observers.push(observer);
    }

    private validate(dto: VerifyEmailVerificationRequestDTO) {
        Email.ensureValid(dto.email);

        if (dto.token.length !== 8)
            throw new InvalidTokenFormatException();
    }

    private async notifyAll(userId: string) {
        await Promise.all(this.observers.map(observer => observer.execute({userId})));
    }

}