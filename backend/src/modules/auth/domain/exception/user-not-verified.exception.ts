import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class UserNotVerifiedException extends DomainException {

    constructor() {
        super("User with unverified email", CategoryError.AUTENTICATE, "NOT_VERIFIED");
    }

}