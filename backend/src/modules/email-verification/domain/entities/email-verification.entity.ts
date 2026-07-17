import Email from "../../../../core/domain/vo/email.vo.js";
import AlreadyEmailVerificationUsedException from "../exception/already-email-verification-used.exception.js";
import ExpiredEmailVerificationException from "../exception/expired-email-verification.exception.js";
import LimitEmailVerificationAttemptsExceededException from "../exception/limit-attempts-exceeded.exception.js";

export default class EmailVerificationEntity {

    private readonly LIMIT_ATTEMPTS = 3;

    constructor(
        private _userId: string,
        private _codeHash: string,
        private _expiresAt: Date,
        private _id: string,
        private _email: Email,
        private _verified: boolean = false,
        private _attempts: number = 0,
    ) {}

    get userId(): string {
        return this._userId;
    }

    get codeHash(): string {
        return this._codeHash;
    }

    get expiresAt(): Date {
        return this._expiresAt;
    }

    get verified(): boolean {
        return this._verified;
    }

    get attempts(): number {
        return this._attempts;
    }

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email.toString();
    }
    
    verify() {
        if (this._verified) {
            throw new AlreadyEmailVerificationUsedException();
        }

        this._verified = true;
    }

    incrementAttempts() {
        if (this._attempts >= this.LIMIT_ATTEMPTS)
            throw new LimitEmailVerificationAttemptsExceededException(this.LIMIT_ATTEMPTS);

        this._attempts++;
    }

    unsureNotExpired() {
        if (this._expiresAt.getTime() < Date.now()) 
            throw new ExpiredEmailVerificationException();
    }

}