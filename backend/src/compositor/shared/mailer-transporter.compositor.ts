import NodemailerMailerTransporter from "../../platform/mailer/mailer-transporter/nodemailer-transporter.infra.js";
import createConnectionMailer from "../../platform/mailer/mailer.connection.js";

export default function mailerTransporterFactory() {
    return new NodemailerMailerTransporter(
        createConnectionMailer()
    );
}