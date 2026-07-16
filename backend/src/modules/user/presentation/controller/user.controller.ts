import { Request, Response } from "express";
import createHttpResponse from "../../../../platform/express/create-response.express.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import { RegisterUserDTOSchema } from "../../application/dto/register/register.dto.js";
import unwrapZodResult from "../../../../platform/zod/unwrap-result.zod.js";

export default class UserController {

    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase
    ) {}

    register = async (req: Request, res: Response) => {
        const resultParse = RegisterUserDTOSchema.safeParse(req.body);
        const body = unwrapZodResult(resultParse);

        await this.registerUserUseCase.execute(body);

        const response = createHttpResponse("User Registered Successfuly", 201);
        res.status(response.statusCode).json(response);
    }

}