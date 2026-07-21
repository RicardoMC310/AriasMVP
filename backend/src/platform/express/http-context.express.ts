import { Request, Response } from "express";

export default class HttpContext<TBody = unknown> {

    constructor(
        public readonly res: Response,
        public readonly req: Request,
        public readonly body: TBody
    ){}

}