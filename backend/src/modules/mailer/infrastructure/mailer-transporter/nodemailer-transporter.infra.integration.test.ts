import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import nodemailer from "nodemailer";
import createConnectionMailer from "../../../../platform/mail/mailer.connection.js";
import SendMailVerificationUseCase from "../../application/use-cases/send-mail-verification.use-case.js";
import NodemailerMailerTransporter from "./nodemailer-transporter.infra.js";
import HandlebarsMailerHtmlCompile from "../html-compiler/handlebars-html-compile.infra.js";
import Email from "../../../../core/domain/vo/email.vo.js";

describe("Teste de integração com o mailpit", () => {
    let transporter: nodemailer.Transporter;
    let sendMailerVerificationUseCase: SendMailVerificationUseCase;

    beforeEach(() => {
        if (!process.env.SMTP_HOST)
            throw new Error("Missing environment variable SMTP_HOST");
        if (!process.env.SMTP_PORT)
            throw new Error("Missing environment variable SMTP_PORT");
        if (!process.env.SMTP_DEBUG_PORT)
            throw new Error("Missing environment variable SMTP_DEBUG_PORT");

        transporter = createConnectionMailer();

        let nodemailerMailerTransporter = new NodemailerMailerTransporter(transporter);
        let mailerHtmlCompile = new HandlebarsMailerHtmlCompile();
        sendMailerVerificationUseCase = new SendMailVerificationUseCase(
            nodemailerMailerTransporter,
            {
                name: "Arias ERP",
                address: Email.create("arias@gmail.com")
            },
            mailerHtmlCompile
        );
    });

    afterEach(async () => {
        transporter.close();
    });

    it("Deve enviar um email ao servidor SMTP", async () => {
        const body = {
            email: "ricardo@gmail.com",
            token: "token"
        };

        await sendMailerVerificationUseCase.execute(body);

        const response = await fetch(`http://${process.env.SMTP_HOST}:${process.env.SMTP_DEBUG_PORT}/api/v1/messages`);
        const data = await response.json();

        expect(data.total).toBe(1);

        const message = data.messages[0];

        expect(message.Subject).toBe("Email Validation (Arias ERP)");
        expect(message.ID).toBeDefined();
        expect(message.MessageID).toBeDefined();
    });

});