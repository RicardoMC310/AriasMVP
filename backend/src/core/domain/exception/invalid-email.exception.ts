import DomainException from "./domain.exception.js";

export default class InvalidEmailException extends DomainException {

    constructor(email: string) {
        super(`Invalid \"${email}\". Please enter a valid email.`);
    }

}