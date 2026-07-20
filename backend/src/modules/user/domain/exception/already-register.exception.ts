import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class UserAlreadyRegisteredException extends DomainException {

    constructor() {
        super("User already registered", CategoryError.CONFLICT, "ALREADY_EXISTS");
    }

}