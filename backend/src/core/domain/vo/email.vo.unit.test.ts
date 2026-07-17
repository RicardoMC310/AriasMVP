import InvalidEmailException from "../exception/invalid-email.exception.js";
import Email from "./email.vo.js";
import { describe, expect, it } from "@jest/globals";

describe("Teste do Value Object Email", () => {

    it("Deve retornar o conteúdo sem alterações", () => {
        const emailRaw = "ricardo@gmail.com";

        const email = Email.create(emailRaw);

        expect(email.toString()).toBe(emailRaw);
    });

    it("Deve lançar uma exceção se o email for inválido", () => {
        expect(() => Email.create("ricardo")).toThrow(InvalidEmailException);
    });

    it("Deve lançar uma exceção se o email estiver vazio", () => {
        expect(() => Email.create("")).toThrow(InvalidEmailException);
    });

    it("Deve lançar uma exceção se o email não tiver domínio", () => {
        expect(() => Email.create("ricardo@")).toThrow(InvalidEmailException);
    });

    it("Deve lançar uma exceção se o email não tiver parte local", () => {
        expect(() => Email.create("@gmail.com")).toThrow(InvalidEmailException);
    });

    it("Deve aceitar emails com caracteres especiais válidos", () => {
        expect(() => Email.create("ricardo.silva+test@gmail.com")).not.toThrow();
    });

    it("Deve retornar igualdade entre emails iguais", () => {
        const email1 = Email.create("ricardo@gmail.com");
        const email2 = Email.create("ricardo@gmail.com");

        expect(email1.equals(email2)).toBe(true);
    });

    it("Deve retornar desigualdade entre emails diferentes", () => {
        const email1 = Email.create("ricardo@gmail.com");
        const email2 = Email.create("outro@gmail.com");

        expect(email1.equals(email2)).toBe(false);
    });

});