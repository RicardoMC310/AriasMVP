import Email from "../../../../core/domain/vo/email.vo.js";
import EmailVerificationEntity from "../entities/email-verification.entity.js";

export default class EmailVerificationEntityBuilder {

    private _userId!: string;
    private _codeHash!: string;
    private _expiresAt!: Date;
    private _verified: boolean = false;
    private _attempts: number = 0;
    private _id!: string;
    private _email!: string;

    static create(): EmailVerificationEntityBuilder {
        return new EmailVerificationEntityBuilder();
    }

    withId(id: string): this {
        this._id = id;
        return this;
    }

    withCodeHash(codeHash: string): this {
        this._codeHash = codeHash;
        return this;
    }

    withExpiresAt(expiresAt: Date): this {
        this._expiresAt = expiresAt;
        return this;
    }

    withVerified(verified: boolean): this {
        this._verified = verified;
        return this;
    }

    withAttempts(attempts: number): this {
        this._attempts = attempts;
        return this;
    }

    withEmail(email: string): this {
        this._email = email;
        return this;
    }

    withUserId(userId: string): this {
        this._userId = userId;
        return this;
    }

    build(): EmailVerificationEntity {
        return new EmailVerificationEntity(
            this._userId,
            this._codeHash,
            this._expiresAt,
            this._id,
            Email.create(this._email),
            this._verified,
            this._attempts,
        );
    }

}