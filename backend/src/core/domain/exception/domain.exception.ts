export enum DetailError {
    NOT_FOUND,
    AUTHORIZATION,
    AUTENTICATE,
    CONFLICT,
    VALIDATION,
    RESTORE
}

export default abstract class DomainException extends Error {

    constructor(
        message: string,
        public detail: DetailError,
        public data?: Record<string, unknown>
    ) {
        super(message);
    }

}