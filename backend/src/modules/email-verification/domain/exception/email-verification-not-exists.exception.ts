import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class EmailVerificationNotExistsException extends DomainException {
    constructor(email: string) {
        super(`Email Verification with email \"${email}\ does not exists"`, CategoryError.NOT_FOUND, "NOT_FOUND");
    }
}