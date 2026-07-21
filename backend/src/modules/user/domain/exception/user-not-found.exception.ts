import DomainException, { CategoryError } from "../../../../core/domain/exception/domain.exception.js";

export default class UserNotFoundException extends DomainException {

    constructor() {
        super("User not found", CategoryError.NOT_FOUND, "NOT_FOUND");
    }

}