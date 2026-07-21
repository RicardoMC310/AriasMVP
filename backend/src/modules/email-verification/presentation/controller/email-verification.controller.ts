import { Request, Response } from "express";
import createHttpResponse from "../../../../platform/express/create-response.express.js";
import ResendEmailVerificationDTO, { ResendEmailVerificationDTOSchema } from "../../application/dto/in/resend-email-verification/resend-email-verification.dto.js";
import unwrapResult from "../../../../platform/zod/unwrap-result.zod.js";
import ResendEmailVerificationUseCase from "../../application/use-cases/resend-email-verification/resend-email-verification.use-case.js";
import VerifyEmailVerificationRequestDTO, { VerifyEmailVerificationRequestDTOSchema } from "../../application/dto/in/verify-email-verifcation/verify-email-verification.dto.js";
import VerifyEmailVerificationUseCase from "../../application/use-cases/verify-email-verification/verify-email-verification.use-case.js";
import HttpContext from "../../../../platform/express/http-context.express.js";

export default class EmailVericationController {

    constructor(
        private readonly resendEmailVerificationUseCase: ResendEmailVerificationUseCase,
        private readonly verifyEmailVerificarionUseCase: VerifyEmailVerificationUseCase
    ) {}

    resend = async (context: HttpContext<ResendEmailVerificationDTO>) => {
        await this.resendEmailVerificationUseCase.execute(context.body);

        const response = createHttpResponse("Check your email inbox", "SUCCESSFULY");
        context.res.status(response.statusCode).json(response);
    }

    verify = async (context: HttpContext<VerifyEmailVerificationRequestDTO>) => {
        await this.verifyEmailVerificarionUseCase.execute(context.body);

        const response = createHttpResponse("User Verified", "SUCCESSFULY");
        context.res.status(response.statusCode).json(response);
    }

}