import Email from "../../../../../core/domain/vo/email.vo.js";
import EmailVerificationEntityBuilder from "../../../domain/builder/email-verification.builder.js";
import CreateEmailVerificationDTO from "../../dto/in/create-email-verification/create-email-verification.dto.js";
import { v7 as uuidv7 } from "uuid";
import IEmailVerificationCodeGenerator from "../../port/code-generator.port.js";
import IEmailVerificationRepository from "../../../domain/repository/email-verification.repository.js";
import IEmailVerificationUpdateObserver from "../../port/observers/email-verification-update-observer.port.js";

export default class CreateEmailVerificationUseCase {

    private readonly MILLISECONDS = 1000;
    private readonly SECONDS = 60;
    private readonly MINUTES = 30;
    private readonly TOKEN_LENGTH = 8;

    private observers: IEmailVerificationUpdateObserver[] = [];

    constructor(
        private readonly codeGenerator: IEmailVerificationCodeGenerator,
        private readonly repository: IEmailVerificationRepository
    ) {}

    async execute(dto: CreateEmailVerificationDTO): Promise<void> {
        this.validate(dto);

        const expiresAt = new Date(
            Date.now() + this.MILLISECONDS * this.SECONDS * this.MINUTES
        );

        const { token, hash } = this.codeGenerator.generator(this.TOKEN_LENGTH);

        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withId(uuidv7())
            .withEmail(dto.email)
            .withUserId(dto.userId)
            .withExpiresAt(expiresAt)
            .withCodeHash(hash)
            .build();

        await this.repository.save(emailVerificationEntity);

        await this.notifyAll(dto.email, token);
    }

    registerObserver(observer: IEmailVerificationUpdateObserver) {
        this.observers.push(observer);
    }

    private validate(dto: CreateEmailVerificationDTO) {
        Email.ensureValid(dto.email);
    }

    private async notifyAll(email: string, token: string) {
        await Promise.all(this.observers.map(observer => observer.execute({ email, token })));
    }
}