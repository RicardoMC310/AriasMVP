import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import createHttpResponse from "../../../../platform/express/create-response.express.js";
import HttpContext from "../../../../platform/express/http-context.express.js";
import RegisterUserDTO from "../../application/dto/register/register.dto.js";

export default class UserController {

    constructor(
        private readonly registerUserUseCase: RegisterUserUseCase
    ) {}

    register = async (ctx: HttpContext<RegisterUserDTO>) => {
        await this.registerUserUseCase.execute(ctx.body);

        const response = createHttpResponse("User Registered. Check your email inbox", "SUCCESSFULY");
        ctx.res.status(response.statusCode).json(response);
    }

}