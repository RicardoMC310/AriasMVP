import { Kysely } from "kysely";
import { DB } from "../../../platform/database/db.js";
import { HttpController } from "../../../platform/express/http-controller.express.js";
import userControllerFactory from "../controller/controller.compositor.js";
import { RegisterUserDTOSchema } from "../../../modules/user/application/dto/register/register.dto.js";
import makeRegisterRouter, { body, responses, response, Registry } from "../../../platform/express/register-router.express.js";

export default function userRouterFactory(db: Kysely<DB>): HttpController {
    const controller = userControllerFactory(db);

    const registry = makeRegisterRouter();

    registry.group("/user", (registry: Registry) => {

        registry.registerRoutePath({

            handler: controller.register,
            path: "/register",

            docs: {
                description: "User Register",

                body: body(RegisterUserDTOSchema, true, {
                    username: "Name Here",
                    email: "example@gmail.com",
                    password: "StrongPassword123@"
                }),

                responses: responses(
                    response(200, "User Registered", "SUCESSFULY"),
                    response(409, "User Already Registered", "ALREADY_EXISTS")
                )
            }
            
        }).post();

    });

    return {
        router: registry.getRouter()
    };
}