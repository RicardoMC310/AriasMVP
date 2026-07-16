import InvalidEmailException from "../exception/invalid-email.exception.js";
import Email from "./email.vo.js";
import { describe, expect, it } from "@jest/globals";

describe("Teste do Value Object Email", () => {

    it("Deve retornar o conteúdo sem alterações", () => {
        const emailRaw = "ricardo@gmail.com";

        const email = Email.create(emailRaw);

        expect(email.toString()).toBe(emailRaw);
    });

    it("Deve lançar uma exceção se um email inválido for passado", () => {
        const emailRaw = "ricardo";

        expect(() => Email.create(emailRaw)).toThrow(InvalidEmailException);
    });

});