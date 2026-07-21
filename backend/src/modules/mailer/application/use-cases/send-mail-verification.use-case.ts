import Email from "../../../../core/domain/vo/email.vo.js";
import MailEntityBuilder from "../../domain/builder/mail-entity.builder.js";
import SendEmailVerificationDTO from "../dto/in/send-email-verification.dto.js";
import IMailerHtmlCompile from "../port/compile-html.port.js";
import IMailerConfigutation from "../port/mail-configuration.port.js";
import IMailerTransporter from "../port/mailer.port.js";

export default class SendMailVerificationUseCase {

    constructor(
        private readonly transporter: IMailerTransporter,
        private readonly configuration: IMailerConfigutation,
        private readonly htmlCompile: IMailerHtmlCompile
    ) { }

    async execute(dto: SendEmailVerificationDTO): Promise<void> {
        this.validate(dto);

        const bodyBuffer = await this.htmlCompile.compile(
            "email-verification",
            {
                "token": dto.token
            }
        );

        const mailEntity = MailEntityBuilder.create()
            .withFrom(`${this.configuration.name} <${this.configuration.address.toString()}>`)
            .withTo(dto.email)
            .withSubject("Email Validation (Arias ERP)")
            .withBody(bodyBuffer.toString("utf-8"))
            .build();

        await this.transporter.sendMail(mailEntity);
    }

    private validate(dto: SendEmailVerificationDTO) {
        Email.ensureValid(dto.email);
    }

}