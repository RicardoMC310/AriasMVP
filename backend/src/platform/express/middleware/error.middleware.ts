import { NextFunction, Request, Response } from "express";
import createHttpResponse from "../create-response.express.js";
import DomainException, { DetailError } from "../../../core/domain/exception/domain.exception.js";
import { STATUS_CODES } from "http";

const mapToHttpCode: Record<DetailError, number> = {
    [DetailError.AUTENTICATE]: 401,
    [DetailError.AUTHORIZATION]: 403,
    [DetailError.CONFLICT]: 409,
    [DetailError.NOT_FOUND]: 404,
    [DetailError.VALIDATION]: 400,
    [DetailError.RESTORE]: 502
};

export default function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    console.log(error.stack);

    if (error instanceof DomainException) {
        const response = createHttpResponse(
            error.message,
            mapToHttpCode[error.detail],
            error.data
        );

        res.status(response.statusCode).json(response);
        next();
        return;
    }


    const response = createHttpResponse(
        error.message,
        500,
    );

    res.status(response.statusCode).json(response);

    next();
}