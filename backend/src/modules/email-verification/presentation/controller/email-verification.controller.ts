import { Request, Response } from "express";
import createHttpResponse from "../../../../platform/express/create-response.express.js";
import { ResendEmailVerificationDTOSchema } from "../../application/dto/in/resend-email-verification/resend-email-verification.dto.js";
import unwrapResult from "../../../../platform/zod/unwrap-result.zod.js";
import ResendEmailVerificationUseCase from "../../application/use-cases/resend-email-verification/resend-email-verification.use-case.js";
import { VerifyEmailVerificationRequestDTOSchema } from "../../application/dto/in/verify-email-verifcation/verify-email-verification.dto.js";
import VerifyEmailVerificationUseCase from "../../application/use-cases/verify-email-verification/verify-email-verification.use-case.js";

export default class EmailVericationController {

    constructor(
        private readonly resendEmailVerificationUseCase: ResendEmailVerificationUseCase,
        private readonly verifyEmailVerificarionUseCase: VerifyEmailVerificationUseCase
    ) {}

    resend = async (req: Request, res: Response) => {
        const bodyRaw = ResendEmailVerificationDTOSchema.safeParse(req.body);
        const body = unwrapResult(bodyRaw);

        await this.resendEmailVerificationUseCase.execute(body);

        const response = createHttpResponse("Check your email inbox", "SUCCESSFULY");
        res.status(response.statusCode).json(response);
    }

    verify = async (req: Request, res: Response) => {
        const bodyRaw = VerifyEmailVerificationRequestDTOSchema.safeParse(req.body);
        const body = unwrapResult(bodyRaw);

        await this.verifyEmailVerificarionUseCase.execute(body);

        const response = createHttpResponse("User Verified", "SUCCESSFULY");
        res.status(response.statusCode).json(response);
    }

}