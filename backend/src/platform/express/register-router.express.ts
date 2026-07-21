import express from "express";
import type { ZodObject } from "zod";
import { z } from "../../docs/zod-openapi.js";
import { registerDoc } from "./openapi-mapper.express.js";
import { registerRoute } from "./route-handler.express.js";
import type { ConfigRouter, HeaderMap, HttpMethod, Registry, ResponseDoc, BodyResponse } from "./types.express.js";

export type { HeaderMap, Registry };

export default function makeRegisterRouter(): Registry {
    const router = express.Router();
    const groupStack: string[] = [];

    return createRegistry(router, groupStack);
}

function createRegistry(router: express.Router, groupStack: string[] = []): Registry {
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
