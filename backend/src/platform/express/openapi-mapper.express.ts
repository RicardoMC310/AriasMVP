import { z } from "../../docs/zod-openapi.js";
import registry from "../../docs/openapi.js";
import type { ConfigRouter, HeaderMap, HttpMethod } from "./types.express.js";

export function registerDoc(config: ConfigRouter, method: HttpMethod) {
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
                        statusCode: Number(status),
                        data: body.dataExample,
                        meta: body.metaExample
                    }
                }
            }
        }

        return acc;
    }, {} as Record<string, any>);
}
