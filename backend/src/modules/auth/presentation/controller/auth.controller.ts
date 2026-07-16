import { Request, Response } from "express";
import AuthLoginUseCase from "../../application/use-case/login/login.use-case.js";
import { AuthLoginRequestDTOSchema } from "../../application/dto/in/login/login-request.dto.js";
import unwrapZodResult from "../../../../platform/zod/unwrap-result.zod.js";
import createHttpResponse from "../../../../platform/express/create-response.express.js";

export default class AuthController {

    private readonly MILLISECONDS = 1000;
    private readonly SECONDS = 60;
    private readonly MINUTES = 60;
    private readonly HOURS = 16;

    constructor(
        private readonly authLoginUseCase: AuthLoginUseCase
    ) {}

    login = async (req: Request, res: Response) => {
        const resultParse = AuthLoginRequestDTOSchema.safeParse(req.body);
        const body = unwrapZodResult(resultParse);

        const data = await this.authLoginUseCase.execute(body);

        res.cookie("accessToken", data.token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: this.MILLISECONDS * this.SECONDS * this.MINUTES * this.HOURS,
            signed: true
        })

        const response = createHttpResponse("login successfuly", 200);
        res.status(response.statusCode).json(response);
    }

}