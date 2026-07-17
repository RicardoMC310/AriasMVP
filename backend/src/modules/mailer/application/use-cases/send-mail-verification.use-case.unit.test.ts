import { describe, it, beforeEach, expect } from "@jest/globals";
import IMailerTransporter from "../port/mailer.port.js";
import MailEntity from "../../domain/entities/mail.entity.js";
import IMailerHtmlCompile from "../port/compile-html.port.js";
import SendMailVerificationUseCase from "./send-mail-verification.use-case.js";
import Email from "../../../../core/domain/vo/email.vo.js";

describe("Teste do caso de uso de enviar email", () => {
    let mailerTransporter: TestFakeMailerTransporter;
    let htmlCompile: TestFakeMailerHtmlCompile;
    let useCase: SendMailVerificationUseCase;

    beforeEach(() => {
        mailerTransporter = new TestFakeMailerTransporter();
        htmlCompile = new TestFakeMailerHtmlCompile();

        useCase = new SendMailVerificationUseCase(
            mailerTransporter,
            {
                name: "Teste",
                address: Email.create("email@email.com")
            },
            htmlCompile
        );
    });

    it("Deve enviar um email de verificação", async () => {
        const body = {
            email: "ricardo@gmail.com",
            token: "token"
        };

        await useCase.execute(body);

        expect(mailerTransporter.mails).toHaveLength(1);

        const mailEntity = mailerTransporter.mails[0];

        expect(mailEntity.from).toBe("Teste <email@email.com>");
        expect(mailEntity.to).toBe(body.email);
        expect(mailEntity.body).toBe("html");
        expect(mailEntity.subject).toBeDefined();
        expect(mailEntity.attachments).toHaveLength(0);
    });

});

class TestFakeMailerTransporter implements IMailerTransporter {

    mails: MailEntity[] = [];

    async sendMail(mailEntity: MailEntity): Promise<void> {
        this.mails.push(mailEntity);
    }

}

class TestFakeMailerHtmlCompile implements IMailerHtmlCompile {

    async compile(filename: string, data: Record<string, unknown>): Promise<Buffer> {
        return Buffer.from("html");
    }

}