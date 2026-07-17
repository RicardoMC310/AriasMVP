import { Request, Response } from "express";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import { RegisterUserDTOSchema } from "../../application/dto/register/register.dto.js";
import unwrapZodResult from "../../../../platform/zod/unwrap-result.zod.js";
import createHttpResponse from "../../../../platform/express/create-response.express.js";

export default class UserController {

    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase
    ) {}

    register = async (req: Request, res: Response) => {
        const bodyRaw = RegisterUserDTOSchema.safeParse(req.body);
        const body = unwrapZodResult(bodyRaw);

        await this.registerUserUseCase.execute(body);

        const response = createHttpResponse("User Registered. Check your email inbox");
        res.status(response.statusCode).json(response);
    }

}