import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import authControllerFactory from "../controller/controller.compositor.js";
import { HttpController } from "../../../platform/express/http-controller.express.js";
import makeRegisterRouter, { body, Registry, response, responses } from "../../../platform/express/register-router.express.js";
import { AuthLoginRequestDTOSchema } from "../../../modules/auth/application/dto/in/login/login-request.dto.js";
import z from "zod";

export default function authRouterFactory(db: Kysely<DB>): HttpController {
    const controller = authControllerFactory(db);

    const registry = makeRegisterRouter();

    registry.group("/auth", (registry: Registry) => {

        registry.registerRoutePath({

            handler: controller.login,
            path: "/login",

            docs: {

                description: "Login in to the System",

                body: body(AuthLoginRequestDTOSchema, true, {
                    email: "example@gmail.com",
                    password: "StrongPassword123!"
                }),

                responses: responses(
                    response(200, "Login Successfuly", "SUCCESSFULY", {
                        headers: {
                            "Set-Cookie": {
                                name: "Set-Cookie",
                                schema: z.string(),
                                description: "Authentication cookie via accessToken"
                            }
                        }
                    }),
                    response(401, "Autenticate Failed", "AUTENTICATION_ERROR", {
                        description: `
                            Possible error codes:
                            - INVALID_CREDENTIALS: Credentials Invalid
                            - NOT_VERIFIED: User with unverified email
                        `
                    }),
                    response(404, "User not found", "NOT_FOUND"),
                )

            }

        }).post();

    });

    return {
        router: registry.getRouter()
    };
}