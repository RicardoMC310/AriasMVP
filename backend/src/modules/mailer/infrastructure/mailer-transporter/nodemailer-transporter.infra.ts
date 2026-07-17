import IMailerTransporter from "../../application/port/mailer.port.js";
import MailEntity from "../../domain/entities/mail.entity.js";
import nodemailer from "nodemailer";

export default class NodemailerMailerTransporter implements IMailerTransporter {

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