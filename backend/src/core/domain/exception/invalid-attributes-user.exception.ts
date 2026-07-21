import DomainException, { CategoryError } from "./domain.exception.js";

export default class InvalidUserAttributeException extends DomainException {

    constructor(attribute: string) {
        super(
            "User attribute " + attribute + " invalid", 
            CategoryError.RESTORE, 
            "INVALID_STATE", 
            {field: attribute}
        );
    }

}