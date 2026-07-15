export default class InvalidPasswordException extends Error {

    constructor() {
        super("The password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character");
    }

}