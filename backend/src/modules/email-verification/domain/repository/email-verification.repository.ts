import EmailVerificationEntity from "../entities/email-verification.entity.js";

export default interface IEmailVerificationRepository {
    save(emailVerificationEntity: EmailVerificationEntity): Promise<void>;
    update(emailVerificationEntity: EmailVerificationEntity): Promise<boolean>;
    findByEmail(email: string): Promise<EmailVerificationEntity | null>;
}