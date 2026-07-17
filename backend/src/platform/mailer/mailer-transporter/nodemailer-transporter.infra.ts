import MailEntity from "../../../modules/mailer/domain/entities/mail.entity.js";
import nodemailer from "nodemailer";

export default class NodemailerMailerTransporter {

    constructor(
        private readonly transporter: nodemailer.Transporter
    ) {}

    async sendMail(mailEntity: MailEntity): Promise<void> {
        await this.transporter.sendMail({
            from: mailEntity.from,
            to: mailEntity.to,
            subject: mailEntity.subject,
            html: mailEntity.body,
            attachments: [
                ...mailEntity.attachments.map(attachment => {
                    return {
                        filename: attachment.filename,
                        content: attachment.filename
                    }
                })
            ]
        });
    }

}