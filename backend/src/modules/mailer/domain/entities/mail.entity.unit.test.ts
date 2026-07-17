import { describe, it, expect } from "@jest/globals"
import MailEntityBuilder from "../builder/mail-entity.builder.js";
import { Readable } from "stream";

describe("Teste da entidade mail", () => {

    it("Deve criar um email sem quaisquer modificações", () => {
        const body = {
            from: "arias@gmail.com",
            to: "ricardo@gmail.com",
            subject: "Bem-Vindo(A) ao Arias ERP",
            body: "<h1>Seja muito bem-vindo(a)!</h1>",
            attachments: [
                {
                    filename: "rules.txt",
                    content: Buffer.from("Regras")
                }
            ]
        };

        const emailEntity = MailEntityBuilder.create()
            .withFrom(body.from)
            .withTo(body.to)
            .withSubject(body.subject)
            .withBody(body.body)
            .withAttachments(body.attachments)
            .build();

        expect(emailEntity.from).toBe(body.from);
        expect(emailEntity.to).toBe(body.to);
        expect(emailEntity.subject).toBe(body.subject);
        expect(emailEntity.body).toBe(body.body);
        expect(emailEntity.attachments).toBe(body.attachments);
    });

    it("Deve permitir anexar um arquivo com o conteudo em string", () => {
        const body = {
            from: "arias@gmail.com",
            to: "ricardo@gmail.com",
            subject: "Bem-Vindo(A) ao Arias ERP",
            body: "<h1>Seja muito bem-vindo(a)!</h1>",
            attachments: [
                {
                    filename: "rules.txt",
                    content: "Regras"
                }
            ]
        };

        const emailEntity = MailEntityBuilder.create()
            .withFrom(body.from)
            .withTo(body.to)
            .withSubject(body.subject)
            .withBody(body.body)
            .withAttachments(body.attachments)
            .build();

        expect(emailEntity.attachments[0].content).toBe(body.attachments[0].content);
    });

    it("Deve permitir anexar um arquivo com o conteudo em Buffer", () => {
        const body = {
            from: "arias@gmail.com",
            to: "ricardo@gmail.com",
            subject: "Bem-Vindo(A) ao Arias ERP",
            body: "<h1>Seja muito bem-vindo(a)!</h1>",
            attachments: [
                {
                    filename: "rules.txt",
                    content: Buffer.from("Regras")
                }
            ]
        };

        const emailEntity = MailEntityBuilder.create()
            .withFrom(body.from)
            .withTo(body.to)
            .withSubject(body.subject)
            .withBody(body.body)
            .withAttachments(body.attachments)
            .build();

        expect(emailEntity.attachments[0].content).toBe(body.attachments[0].content);
    });

    it("Deve permitir anexar um arquivo com o conteudo em Stream", () => {
        const body = {
            from: "arias@gmail.com",
            to: "ricardo@gmail.com",
            subject: "Bem-Vindo(A) ao Arias ERP",
            body: "<h1>Seja muito bem-vindo(a)!</h1>",
            attachments: [
                {
                    filename: "rules.txt",
                    content: new Readable({
                        read(size) {
                            this.push("Olá")
                        },
                    })
                }
            ]
        };

        const emailEntity = MailEntityBuilder.create()
            .withFrom(body.from)
            .withTo(body.to)
            .withSubject(body.subject)
            .withBody(body.body)
            .withAttachments(body.attachments)
            .build();

        expect(emailEntity.attachments[0].content).toBe(body.attachments[0].content);
    });

    it("Deve criar um email sem anexos", () => {
        const emailEntity = MailEntityBuilder.create()
            .withFrom("arias@gmail.com")
            .withTo("ricardo@gmail.com")
            .withSubject("Teste")
            .withBody("<p>Corpo</p>")
            .build();

        expect(emailEntity.from).toBe("arias@gmail.com");
        expect(emailEntity.to).toBe("ricardo@gmail.com");
        expect(emailEntity.attachments).toHaveLength(0);
    });

    it("Deve criar um email com múltiplos anexos", () => {
        const emailEntity = MailEntityBuilder.create()
            .withFrom("arias@gmail.com")
            .withTo("ricardo@gmail.com")
            .withSubject("Teste")
            .withBody("<p>Corpo</p>")
            .withAttachments([
                { filename: "file1.txt", content: "conteudo1" },
                { filename: "file2.txt", content: Buffer.from("conteudo2") }
            ])
            .build();

        expect(emailEntity.attachments).toHaveLength(2);
    });

});