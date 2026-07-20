import EmailVerificationEntity from "../../domain/entities/email-verification.entity.js";
import IEmailVerificationRepository from "../../domain/repository/email-verification.repository.js";

export default class TestFakeEmailVerificationRepository implements IEmailVerificationRepository {

    emails: EmailVerificationEntity[] = [];
    shouldFail = false;

    async save(emailVerificationEntity: EmailVerificationEntity): Promise<void> {
        if (this.shouldFail) throw new Error("Repository save failed");

        this.emails.push(emailVerificationEntity);
    }

    injectEntity(entities: EmailVerificationEntity[]) {
        this.emails = entities;
    }

    async update(emailVerificationEntity: EmailVerificationEntity): Promise<boolean> {
        if (this.shouldFail) throw new Error("Repository update failed");

        const index = this.emails.findIndex(email => email.email === emailVerificationEntity.email);

        if (index === -1)
            return false;

        this.emails[index] = emailVerificationEntity;

        return true;
    }

    async findByEmail(email: string): Promise<EmailVerificationEntity | null> {
        if (this.shouldFail) throw new Error("Repository find failed");

        const index = this.emails.findIndex(emailEntity => emailEntity.email === email);

        if (index === -1)
            return null;

        return this.emails[index];
    }

}