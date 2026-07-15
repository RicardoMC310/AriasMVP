import { NextFunction, Request, Response } from "express";
import createHttpResponse from "../create-response.express.js";

export default function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
    console.log(error.stack);

    const response = createHttpResponse(
        error.message,
        500,
    );

    res.status(response.statusCode).json(response);
    
    next();
}