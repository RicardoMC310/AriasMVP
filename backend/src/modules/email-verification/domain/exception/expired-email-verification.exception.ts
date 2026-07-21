import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class ExpiredEmailVerificationException extends DomainException {

    constructor() {
        super("Verification email expired", CategoryError.AUTENTICATE, "EXPIRED");
    }

}