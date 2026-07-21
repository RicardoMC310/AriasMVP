import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class AlreadyEmailVerificationUsedException extends DomainException {

    constructor() {
        super("A verification email cannot be used twice", CategoryError.VALIDATION, "ALREADY_EXISTS");
    }

}