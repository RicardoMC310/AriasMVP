import DomainException, { DetailError } from "../../../../core/domain/exception/domain.exception.js";

export default class EmailVerificationNotExistsException extends DomainException {
    constructor(email: string) {
        super(`Email Verification with email \"${email}\ does not exists"`, DetailError.NOT_FOUND);
    }
}