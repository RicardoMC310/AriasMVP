export enum CategoryError {
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
        public detail: CategoryError,
        public code: string,
        public meta?: Record<string, unknown>
    ) {
        super(message);
    }

}