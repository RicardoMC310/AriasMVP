import DomainException, { DetailError } from "../../../../core/domain/exception/domain.exception.js";

export default class AuthCredentialsInvalidException extends DomainException {

    constructor() {
        super("Credentials Invalid", DetailError.AUTENTICATE);
    }

}