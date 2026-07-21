import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class InvalidEmailVerificationTokenException extends DomainException {

    constructor() {
        super(
            "Code does not match",
            CategoryError.VALIDATION,
            "INVALID_CODE"
        );
    }

}