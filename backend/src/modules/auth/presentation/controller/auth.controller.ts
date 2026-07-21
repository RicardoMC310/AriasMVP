import { Request, Response } from "express";
import AuthLoginUseCase from "../../application/use-case/login/login.use-case.js";
import AuthLoginRequestDTO, { AuthLoginRequestDTOSchema } from "../../application/dto/in/login/login-request.dto.js";
import unwrapResult from "../../../../platform/zod/unwrap-result.zod.js";
import loadEnv from "../../../../platform/env/load.env.js";
import createHttpResponse from "../../../../platform/express/create-response.express.js";
import HttpContext from "../../../../platform/express/http-context.express.js";

export default class AuthController {

    private readonly MILLISECONDS = 1000;
    private readonly SECONDS = 60;
    private readonly MINUTES = 15;

    constructor(
        private readonly loginUseCase: AuthLoginUseCase
    ) { }

    login = async (context: HttpContext<AuthLoginRequestDTO>) => {
        const { token } = await this.loginUseCase.execute(context.body);

        context.res.cookie("accessToken", token, {
            httpOnly: true,
            sameSite: "lax",
            signed: true,
            path: "/",
            secure: loadEnv("COOKIE_SECURE", "false") === "true",
            maxAge: this.MILLISECONDS * this.SECONDS * this.MINUTES
        });

        const response = createHttpResponse("Login Successfuly", "SUCCESSFULY");
        context.res.status(response.statusCode).json(response);
    }

}