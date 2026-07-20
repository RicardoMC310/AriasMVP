import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class LimitEmailVerificationAttemptsExceededException extends DomainException {

    constructor(limit: number) {
        super("Limit of " + limit + " email verification attempts reached", CategoryError.AUTENTICATE, "LIMIT_EXCEEDED");
    }

}