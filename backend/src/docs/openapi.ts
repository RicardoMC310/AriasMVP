import { OpenAPIRegistry, OpenApiGeneratorV32 } from "@asteasolutions/zod-to-openapi";

const registry = new OpenAPIRegistry();

export function generateOpenAPIDocument() {
    const generator = new OpenApiGeneratorV32(registry.definitions);

    return generator.generateDocument({
        openapi: "3.1.0",
        info: {
            title: "Arias ERP",
            version: "1.0.0",
            description: "Documentação da API"
        },
        servers: [
            {
                url: "https://localhost:8080"
            }
        ]
    });
}

export default registry;