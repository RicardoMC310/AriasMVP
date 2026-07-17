import { Kysely } from "kysely";
import IEmailVerificationRepository from "../../domain/repository/email-verification.repository.js";
import { DB } from "../../../../platform/database/db.js";
import EmailVerificationEntity from "../../domain/entities/email-verification.entity.js";

export default class KyselyEmailVerificationRepository implements IEmailVerificationRepository {
    
    constructor(
        private readonly db: Kysely<DB>
    ){}

    async save(emailVerificationEntity: EmailVerificationEntity): Promise<void> {
        await this.db.insertInto("email_verification")
            .values({
                id: emailVerificationEntity.id,
                code_hash: emailVerificationEntity.codeHash,
                expiresAt: emailVerificationEntity.expiresAt,
                user_id: emailVerificationEntity.userId,
                attempts: emailVerificationEntity.attempts,
                verified: emailVerificationEntity.verified,
                email: emailVerificationEntity.email
            })
            .execute();
    }

    async update(emailVerificationEntity: EmailVerificationEntity): Promise<boolean> {
        const found = await this.db.selectFrom("email_verification")
            .select("email")
            .where("email", "=", emailVerificationEntity.email)
            .executeTakeFirst();

        if (found === undefined)
                return false;

        await this.db.updateTable("email_verification")
            .set("attempts", emailVerificationEntity.attempts)
            .set("code_hash", emailVerificationEntity.codeHash)
            .set("expiresAt", emailVerificationEntity.expiresAt)
            .set("verified", emailVerificationEntity.verified)
            .set("email", emailVerificationEntity.email)
            .where("email", "=", emailVerificationEntity.email)
            .execute();
        return true;
    }

}