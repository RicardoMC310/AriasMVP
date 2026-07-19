import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import IEmailVerificationCodeGenerator from "../../application/port/code-generator.port.js";

export default class EmailVericationCodeGenerator implements IEmailVerificationCodeGenerator {

    private readonly CHARACTERS_LIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    generator(length: number): { token: string; hash: string; } {
        const token = Array.from(
            { length }, 
            () => this.CHARACTERS_LIST[randomInt(this.CHARACTERS_LIST.length)]
        ).join("");

        return {
            token,
            hash: this.hash(token)
        };
    }

    verify(hash: string, token: string): boolean {
        const rehash = this.hash(token);

        return timingSafeEqual(
            Buffer.from(hash, "hex"),
            Buffer.from(rehash, "hex")
        );
    }

    private hash(text: string): string {
        return createHash("sha256")
            .update(text)
            .digest("hex");
    }

}