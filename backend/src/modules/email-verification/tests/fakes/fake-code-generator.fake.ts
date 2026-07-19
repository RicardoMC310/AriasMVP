import { randomInt } from "crypto";
import IEmailVerificationCodeGenerator from "../../application/port/code-generator.port.js";
import { jest } from "@jest/globals";

export default class TestFakeEmailVerificationCodeGenerator implements IEmailVerificationCodeGenerator {

    shouldFail = false;
    private readonly CHARACTERS_LIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    generator(length: number): { token: string; hash: string; } {
        if (this.shouldFail) throw new Error("Code generation failed");

        const token = Array.from(
            { length },
            () => this.CHARACTERS_LIST[randomInt(this.CHARACTERS_LIST.length)]
        ).join("");

        return {
            token,
            hash: "hashed:" + token
        };
    }

    verify = jest.fn<(hash: string, text: string) => boolean>();

}