import z from "zod";
import DomainException, { CategoryError } from "../../core/domain/exception/domain.exception.js";

class ZodException extends DomainException {

    constructor(message: string) {
        super(message, CategoryError.VALIDATION, "INVALID_INPUT");
    }

}

export default function unwrapResult<T>(result: z.ZodSafeParseResult<T>): T {
    if (!result.success) {
        const message = result.error.issues
            .map(issue => `${issue.path} - ${issue.message}`)
            .join(", ");

        throw new ZodException(message);
    }

    return result.data;
}