import { Request, Response } from "express";
import createHttpResponse from "../../../../platform/express/create-response.express.js";

export default class EmailVericationController {

    constructor() {}

    resend = async (req: Request, res: Response) => {
        const response = createHttpResponse();
        res.status(response.statusCode).json(response);
    }

}