import { describe, it, beforeEach, expect, jest } from "@jest/globals";
import IMailerTransporter from "../port/mailer.port.js";
import MailEntity from "../../domain/entities/mail.entity.js";
import IMailerHtmlCompile from "../port/compile-html.port.js";
import SendMailVerificationUseCase from "./send-mail-verification.use-case.js";
import Email from "../../../../core/domain/vo/email.vo.js";
import InvalidEmailException from "../../../../core/domain/exception/invalid-email.exception.js";

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

    it("Deve enviar um email de verificação com todos os campos corretos", async () => {
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
        expect(mailEntity.subject).toBe("Email Validation (Arias ERP)");
        expect(mailEntity.attachments).toHaveLength(0);
    });

    it("Deve chamar o compilador com o template correto", async () => {
        const body = {
            email: "ricardo@gmail.com",
            token: "abc123"
        };

        await useCase.execute(body);

        expect(htmlCompile.lastFilename).toBe("email-verification");
        expect(htmlCompile.lastData).toEqual({ token: "abc123" });
    });

    it("Deve lançar exceção se o email for inválido", async () => {
        const body = {
            email: "email-invalido",
            token: "token"
        };

        await expect(useCase.execute(body)).rejects.toThrow(InvalidEmailException);

        expect(mailerTransporter.mails).toHaveLength(0);
    });

    it("Deve lançar exceção se o compilador HTML falhar", async () => {
        htmlCompile.shouldFail = true;

        const body = {
            email: "ricardo@gmail.com",
            token: "token"
        };

        await expect(useCase.execute(body)).rejects.toThrow("HTML compile failed");

        expect(mailerTransporter.mails).toHaveLength(0);
    });

    it("Deve lançar exceção se o transportador falhar ao enviar", async () => {
        mailerTransporter.shouldFail = true;

        const body = {
            email: "ricardo@gmail.com",
            token: "token"
        };

        await expect(useCase.execute(body)).rejects.toThrow("Send mail failed");
    });

});

class TestFakeMailerTransporter implements IMailerTransporter {

    mails: MailEntity[] = [];
    shouldFail = false;

    async sendMail(mailEntity: MailEntity): Promise<void> {
        if (this.shouldFail) throw new Error("Send mail failed");

        this.mails.push(mailEntity);
    }

}

class TestFakeMailerHtmlCompile implements IMailerHtmlCompile {

    shouldFail = false;
    lastFilename = "";
    lastData: Record<string, unknown> = {};

    async compile(filename: string, data: Record<string, unknown>): Promise<Buffer> {
        if (this.shouldFail) throw new Error("HTML compile failed");

        this.lastFilename = filename;
        this.lastData = data;

        return Buffer.from("html");
    }

}