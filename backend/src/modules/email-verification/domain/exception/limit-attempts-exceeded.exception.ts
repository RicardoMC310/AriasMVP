import DomainException, { DetailError } from "../../../../core/domain/exception/domain.exception.js";

export default class LimitEmailVerificationAttemptsExceededException extends DomainException {

    constructor(limit: number) {
        super("Limit of 5 email verification attempts reached", DetailError.AUTENTICATE);
    }

}