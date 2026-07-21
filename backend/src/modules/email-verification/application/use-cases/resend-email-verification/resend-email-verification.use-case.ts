import Email from "../../../../../core/domain/vo/email.vo.js";
import EmailVerificationEntityBuilder from "../../../domain/builder/email-verification.builder.js";
import AlreadyEmailVerificationUsedException from "../../../domain/exception/already-email-verification-used.exception.js";
import EmailVerificationNotExistsException from "../../../domain/exception/email-verification-not-exists.exception.js";
import IEmailVerificationRepository from "../../../domain/repository/email-verification.repository.js";
import ResendEmailVerificationDTO from "../../dto/in/resend-email-verification/resend-email-verification.dto.js";
import IEmailVerificationCodeGenerator from "../../port/code-generator.port.js";
import IEmailVerificationUpdateObserver from "../../port/observers/email-verification-update-observer.port.js";

export default class ResendEmailVerificationUseCase {

    private readonly MILLISECONDS = 1000;
    private readonly SECONDS = 60;
    private readonly MINUTES = 30;
    private readonly TOKEN_LENGTH = 8;

    private readonly observers: IEmailVerificationUpdateObserver[] = [];

    constructor(
        private readonly repository: IEmailVerificationRepository,
        private readonly codeGenerator: IEmailVerificationCodeGenerator
    ) { }

    async execute(dto: ResendEmailVerificationDTO): Promise<void> {
        this.validateInput(dto);

        const found = await this.repository.findByEmail(dto.email);

        if (found !== null && found.verified)
            throw new AlreadyEmailVerificationUsedException();

        const expiresAt = new Date(
            Date.now() + this.MILLISECONDS * this.SECONDS * this.MINUTES
        );

        const { token, hash } = this.codeGenerator.generator(this.TOKEN_LENGTH);

        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withEmail(dto.email)
            .withExpiresAt(expiresAt)
            .withCodeHash(hash)
            .build();

        const isSuccess = await this.repository.update(emailVerificationEntity);

        if (!isSuccess) {
            throw new EmailVerificationNotExistsException(dto.email);
        }

        await this.notifyAll(dto.email, token);
    }

    registerObserver(observer: IEmailVerificationUpdateObserver) {
        this.observers.push(observer);
    }

    private validateInput(dto: ResendEmailVerificationDTO) {
        Email.ensureValid(dto.email);
    }

    private async notifyAll(email: string, token: string) {
        await Promise.all(this.observers.map(observer => observer.execute({ email, token })));
    }

}