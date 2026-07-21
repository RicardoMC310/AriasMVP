import type { ZodObject, ZodType } from "zod";
import { z } from "../../docs/zod-openapi.js";
import HttpContext from "./http-context.express.js";

export type Header = {
    name: string;
    schema: ZodType;
    description: string;
    example?: unknown;
};

export type HeaderMap = Record<string, Header>;

export type ResponseDoc = {
    statusCode: number,
    message: string,
    code: string,
    description?: string,
    data?: ZodObject,
    meta?: ZodObject,
    headers?: HeaderMap;
};

export type BodyRequest<T extends ZodObject = ZodObject> = {
    required?: boolean;
    content: T;
    example?: z.infer<T>;
};

export type BodyResponse<T extends ZodObject = ZodObject> = {
    description?: string;

    data?: T;
    dataExample?: z.infer<T>;

    meta?: ZodObject;
    metaExample?: unknown;

    message: string;
    code: string;

    headers?: HeaderMap;
}

export type ConfigRouter<T extends ZodObject = ZodObject> = {
    handler: (context: HttpContext<z.infer<T>>) => Promise<void>;
    path: string;

    docs?: {
        description?: string;
        body?: BodyRequest<T>;
        headers?: HeaderMap;
        responses: Record<number, BodyResponse>;
    }
};

export type HttpMethod =
    "get" | "post" | "delete" | "patch" | "put";

export type RegistryMethods = {
    post: () => void;
    get: () => void;
    delete: () => void;
    patch: () => void;
    put: () => void;
};

export type Registry = {
    registerRoutePath: <T extends ZodObject = ZodObject>(config: ConfigRouter<T>) => RegistryMethods;
    getRouter: () => import("express").Router;
    group: (prefix: string, callback: (registy: Registry) => void) => void;
};
