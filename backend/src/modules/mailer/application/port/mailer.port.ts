import MailEntity from "../../domain/entities/mail.entity.js";

export default interface IMailerTransporter {
    sendMail(mailEntity: MailEntity): Promise<void>;
}