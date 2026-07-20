import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class AuthCredentialsInvalidException extends DomainException {

    constructor() {
        super("Credentials Invalid", CategoryError.AUTENTICATE, "INVALID_CREDENTIALS");
    }

}