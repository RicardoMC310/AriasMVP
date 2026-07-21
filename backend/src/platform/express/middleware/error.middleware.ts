import { NextFunction, Request, Response } from "express";
import createHttpResponse from "../create-response.express.js";
import DomainException, { CategoryError } from "../../../core/domain/exception/domain.exception.js";

const mapToHttpCode: Record<CategoryError, number> = {
    [CategoryError.AUTENTICATE]: 401,
    [CategoryError.AUTHORIZATION]: 403,
    [CategoryError.CONFLICT]: 409,
    [CategoryError.NOT_FOUND]: 404,
    [CategoryError.VALIDATION]: 400,
    [CategoryError.RESTORE]: 502
};

export default function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    console.log(error.stack);

    if (error instanceof DomainException) {
        const response = createHttpResponse(
            error.message,
            error.code,
            mapToHttpCode[error.detail],
            [],
            error.meta
        );

        res.status(response.statusCode).json(response);
        next();
        return;
    }


    const response = createHttpResponse(
        error.message,
        "INTERNAL_ERROR",
        500,
    );

    res.status(response.statusCode).json(response);

    next();
}