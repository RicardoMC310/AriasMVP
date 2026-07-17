import { Request, Response } from "express";
import createHttpResponse from "../../../../platform/express/create-response.express.js";
import { ResendEmailVerificationDTOSchema } from "../../application/dto/in/resend-email-verification/resend-email-verification.dto.js";
import unwrapResult from "../../../../platform/zod/unwrap-result.zod.js";
import ResendEmailVerificationUseCase from "../../application/use-cases/resend-email-verification/resend-email-verification.use-case.js";

export default class EmailVericationController {

    constructor(
        private readonly resendEmailVerificationUseCase: ResendEmailVerificationUseCase
    ) {}

    resend = async (req: Request, res: Response) => {
        const bodyRaw = ResendEmailVerificationDTOSchema.safeParse(req.body);
        const body = unwrapResult(bodyRaw);

        await this.resendEmailVerificationUseCase.execute(body);

        const response = createHttpResponse("Check your email inbox");
        res.status(response.statusCode).json(response);
    }

}