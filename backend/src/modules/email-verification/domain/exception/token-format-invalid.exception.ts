import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class InvalidTokenFormatException extends DomainException {

    constructor() {
        super(
            "Invalid token format",
            CategoryError.VALIDATION,
            "INVALID_FORMAT"
        );
    }

}