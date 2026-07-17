import Email from "../../../../core/domain/vo/email.vo.js";
import SendMailVerificationUseCase from "../../../../modules/mailer/application/use-cases/send-mail-verification.use-case.js";
import loadEnv from "../../../../platform/env/load.env.js";
import mailerHtmlCompileFactory from "../../../shared/html-compile.compositor.js";
import mailerTransporterFactory from "../../../shared/mailer-transporter.compositor.js";

export default function sendEmailVerificationUseCaseFactory() {
    return new SendMailVerificationUseCase(
        mailerTransporterFactory(),
        {
            name: loadEnv("SMTP_FROM_NAME"),
            address: Email.create(loadEnv("SMTP_FROM"))
        },
        mailerHtmlCompileFactory()
    );
}