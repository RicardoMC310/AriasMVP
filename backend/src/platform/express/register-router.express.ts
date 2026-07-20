import { NextFunction, Request, Response, Router } from "express";
import express from "express";
import { z } from "../../docs/zod-openapi.js";
import type { ZodObject, ZodType } from "zod";
import registry from "../../docs/openapi.js";
import HttpContext from "./http-context.express.js";
import unwrapResult from "../zod/unwrap-result.zod.js";

type Header = {
    name: string;
    schema: ZodType;
    description: string;
    example?: unknown;
};

type HeaderMap = Record<string, Header>;

type ResponseDoc = {
    statusCode: number,
    message: string,
    code: string,
    description?: string,
    data?: ZodObject,
    meta?: ZodObject,
    headers?: HeaderMap;
};

type BodyRequest<T extends ZodObject = ZodObject> = {
    required?: boolean;
    content: T;
    example?: z.infer<T>;
};

type BodyResponse<T extends ZodObject = ZodObject> = {
    description?: string;

    data?: T;
    dataExample?: z.infer<T>;

    meta?: ZodObject;
    metaExample?: unknown;

    message: string;
    code: string;

    headers?: HeaderMap;
}

type ConfigRouter<T extends ZodObject = ZodObject> = {
    handler: (context: HttpContext<z.infer<T>>) => Promise<void>;
    path: string;

    docs?: {
        description?: string;
        body?: BodyRequest<T>;
        headers?: HeaderMap;
        responses: Record<number, BodyResponse>;
    }
};

type HttpMethod =
    "get" | "post" | "delete" | "patch" | "put";

type RegistryMethods = {
    post: () => void;
    get: () => void;
    delete: () => void;
    patch: () => void;
    put: () => void;
};

export type Registry = {
    registerRoutePath: <T extends ZodObject = ZodObject>(config: ConfigRouter<T>) => RegistryMethods;
    getRouter: () => Router;
    group: (prefix: string, callback: (registy: Registry) => void) => void;
};

export default function makeRegisterRouter(): Registry {
    const router = express.Router();
    const groupStack: string[] = [];

    return createRegistry(router, groupStack);
}

function createRegistry(router: Router, groupStack: string[] = []): Registry {
    return {
        registerRoutePath<T extends ZodObject = ZodObject>(config: ConfigRouter<T>) {
            config.path = groupStack.join("") + config.path;

            return {
                post() {
                    registerDoc(config, "post");
                    registerRoute(config, "post", router);
                },
                get() {
                    registerDoc(config, "get");
                    registerRoute(config, "get", router);
                },
                delete() {
                    registerDoc(config, "delete");
                    registerRoute(config, "delete", router);
                },
                patch() {
                    registerDoc(config, "patch");
                    registerRoute(config, "patch", router);
                },
                put() {
                    registerDoc(config, "put");
                    registerRoute(config, "put", router);
                }
            };
        },

        getRouter() {
            return router;
        },

        group(prefix: string, callback: (registry: Registry) => void) {
            groupStack.push(prefix);
            callback(createRegistry(router, groupStack));
            groupStack.pop();
        }
    };
}

function registerDoc(config: ConfigRouter, method: HttpMethod) {
    registry.registerPath({
        path: config.path,
        method: method,
        request: {
            body: mapBody(config.docs),
            headers: mapHeaders(config.docs?.headers)
        },
        responses: {
            ...mapReponses(config.docs)
        }
    });
}

function mapBody(docs?: ConfigRouter["docs"]) {
    if (docs === undefined || docs!.body === undefined) return undefined;

    return {
        required: docs.body.required,
        content: {
            "application/json": {
                schema: docs.body.content,
                example: docs.body.example
            }
        }
    }
}

function mapHeaders(headers?: HeaderMap) {
    if (!headers) return undefined;

    const shape = Object.fromEntries(
        Object.values(headers).map(header => [
            header.name,
            header.schema.describe(header.description).openapi({ example: header.example })
        ])
    );

    return z.object(shape);
}

function mapReponses(docs: ConfigRouter["docs"]) {
    if (docs === undefined) return undefined;

    return Object.entries(docs.responses).reduce((acc, [status, body]) => {
        acc[status] = {
            description: body.description,
            headers: mapHeaders(body.headers),
            content: {
                "application/json": {
                    schema: z.object({
                        message: z.string(),
                        code: z.string(),
                        data: body.data ?? z.object({}),
                        meta: body.meta ?? z.object({}),
                        statusCode: z.number()
                    }),

                    example: {
                        message: body.message,
                        code: body.code,
                        statusCode: 200,
                        data: body.dataExample,
                        meta: body.metaExample
                    }
                }
            }
        }

        return acc;
    }, {} as Record<string, any>);
}

function registerRoute<T extends ZodObject = ZodObject>(config: ConfigRouter, method: HttpMethod, router: Router) {
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

export function response(
    statusCode: number,
    message: string,
    code: string,
    type?: {
        description?: string,
        data?: ZodObject,
        meta?: ZodObject,
        headers?: HeaderMap
    }
): ResponseDoc {
    return {
        statusCode,
        message,
        code,
        description: type?.description,
        data: type?.data,
        meta: type?.meta,
        headers: type?.headers
    };
}

export function responses(...responses: ResponseDoc[]): Record<number, BodyResponse> {
    return Object.fromEntries(
        responses.map(r => [r.statusCode, r])
    );
}

export function body<T extends ZodObject = ZodObject>(content: T, required?: boolean, example?: z.infer<T>) {
    return {
        content,
        required,
        example
    };
}

export type { HeaderMap };
