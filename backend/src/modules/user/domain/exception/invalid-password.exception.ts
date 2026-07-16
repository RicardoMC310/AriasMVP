import DomainException, { DetailError } from "../../../../core/domain/exception/domain.exception.js";

export default class InvalidPasswordException extends DomainException {

    constructor() {
        super("The password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character", DetailError.VALIDATION);
    }

}