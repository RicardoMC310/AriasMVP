import { NextFunction, Request, Response, Router } from "express";
import { z } from "../../docs/zod-openapi.js";
import type { ZodObject } from "zod";
import HttpContext from "./http-context.express.js";
import unwrapResult from "../zod/unwrap-result.zod.js";
import type { ConfigRouter, HttpMethod } from "./types.express.js";

export function registerRoute<T extends ZodObject = ZodObject>(config: ConfigRouter, method: HttpMethod, router: Router) {
    switch (method) {
        case "post": {
            router.post(config.path, createHandler<T>(config));
            break;
        }
        case "get": {
            router.get(config.path, createHandler<T>(config));
            break;
        }
        case "delete": {
            router.delete(config.path, createHandler<T>(config));
            break;
        }
        case "patch": {
            router.patch(config.path, createHandler<T>(config));
            break;
        }
        case "put": {
            router.put(config.path, createHandler<T>(config));
            break;
        }
        default:
            throw new Error(`Method ${method} not allowed`);
    }
}

function createHandler<T extends ZodObject = ZodObject>(config: ConfigRouter) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let body = {} as z.infer<T>;

            if (config.docs?.body) {
                let result = config.docs?.body.content.safeParse(req.body);
                body = unwrapResult(result) as z.infer<T>;
            }

            const context = new HttpContext<z.infer<T>>(res, req, body);

            await config.handler(context);
        } catch (error) {
            next(error)
        }
    }
}
