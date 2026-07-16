import { describe, expect, it } from "@jest/globals";
import EmailVerificationEntityBuilder from "../builder/email-verification.builder.js";
import { EventEmitterAsyncResource } from "node:events";
import AlreadyEmailVerificationUsedException from "../exception/already-email-verification-used.exception.js";
import LimitEmailVerificationAttemptsExceededException from "../exception/limit-attempts-exceeded.exception.js";
import ExpiredEmailVerificationException from "../exception/expired-email-verification.exception.js";

describe("Testes da entidade de verificação de email", () => {

    it("Deve retornar sem quaisquer alterações", () => {
        const id = "101010";
        const codeHash = "hashed:code";
        const expiresAt = new Date();
        expiresAt.setMinutes(
            expiresAt.getMinutes() + 30
        );
        const attempts = 2;
        const verified = true;
        const email = "ricardo@gmail.com";

        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withId(id)
            .withCodeHash(codeHash)
            .withExpiresAt(expiresAt)
            .withAttempts(attempts)
            .withVerified(verified)
            .withEmail(email)
            .build();

        expect(emailVerificationEntity.id).toBe(id);
        expect(emailVerificationEntity.codeHash).toBe(codeHash);
        expect(emailVerificationEntity.attempts).toBe(attempts);
        expect(emailVerificationEntity.expiresAt).toBe(expiresAt);
        expect(emailVerificationEntity.verified).toBe(verified);
        expect(emailVerificationEntity.email).toBe(email);
    });

    it("Deve permitir marcar como verificado", () => {
        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withId("101010")
            .withCodeHash("hashed:code")
            .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
            .withAttempts(0)
            .withVerified(false)
            .withEmail("ricardo@gmail.com")
            .build();

        emailVerificationEntity.verify();

        expect(emailVerificationEntity.verified).toBe(true);
    });

    it("Deve bloquear marcar como verificado se já estiver marcado", () => {
        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withId("101010")
            .withCodeHash("hashed:code")
            .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
            .withAttempts(0)
            .withVerified(true)
            .withEmail("ricardo@gmail.com")
            .build();

        expect(() => emailVerificationEntity.verify()).toThrow(AlreadyEmailVerificationUsedException);

        expect(emailVerificationEntity.verified).toBe(true);
    });

    it("Deve incrementar número de tentativas", () => {
        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withId("101010")
            .withCodeHash("hashed:code")
            .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
            .withAttempts(0)
            .withVerified(false)
            .withEmail("ricardo@gmail.com")
            .build();

        emailVerificationEntity.incrementAttempts();

        expect(emailVerificationEntity.attempts).toBe(1);
    });

    it("Deve bloquear caso limite de tentativas for excedido", () => {
        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withId("101010")
            .withCodeHash("hashed:code")
            .withExpiresAt(new Date(Date.now() + 1000 * 60 * 30))
            .withAttempts(3)
            .withVerified(false)
            .withEmail("ricardo@gmail.com")
            .build();

        expect(() => emailVerificationEntity.incrementAttempts()).toThrow(LimitEmailVerificationAttemptsExceededException);

        expect(emailVerificationEntity.attempts).toBe(3);
    });

    it("Deve bloquear caso já esteja expirado", () => {
        const emailVerificationEntity = EmailVerificationEntityBuilder.create()
            .withId("101010")
            .withCodeHash("hashed:code")
            .withExpiresAt(new Date(Date.now() - 1000 * 20))
            .withAttempts(0)
            .withVerified(false)
            .withEmail("ricardo@gmail.com")
            .build();

        expect(() => emailVerificationEntity.unsureNotExpired()).toThrow(ExpiredEmailVerificationException);
    });

});