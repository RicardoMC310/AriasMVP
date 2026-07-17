import DomainException, { DetailError } from "./domain.exception.js";

export default class InvalidUserAttributeException extends DomainException {

    constructor(attribute: string) {
        super("User attribute " + attribute + " invalid", DetailError.RESTORE)
    }

}