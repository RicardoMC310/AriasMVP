import { Request, Response } from "express";
import createHttpResponse from "../../../../platform/express/create-response.express.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import { RegisterUserDTOSchema } from "../../application/use-cases/dto/register/register.dto.js";

export default class UserController {

    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase
    ) {}

    register = async (req: Request, res: Response) => {
        const body = RegisterUserDTOSchema.safeParse(req.body);

        if (!body.success || body.data === undefined) {
            throw new Error(body.error!.issues.reduce((total, current) => {
                return total + (total !== "" ? "," : "") + (current.path + "-" + current.message)
            }, ""));
        } 

        await this.registerUserUseCase.execute(body.data);

        const response = createHttpResponse("User Registered Successfuly", 201);
        res.status(response.statusCode).json(response);
    }

}