import DomainException, { DetailError } from "../../../../core/domain/exception/domain.exception.js";

export default class UserNotFoundException extends DomainException {

    constructor() {
        super("User not found", DetailError.NOT_FOUND);
    }

}