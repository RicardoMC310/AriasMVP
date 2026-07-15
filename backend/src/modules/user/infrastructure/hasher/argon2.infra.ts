import IUserHasher from "../../application/use-cases/port/hasher.port.js";
import argon2 from "argon2";

export default class ArgonUserHasher implements IUserHasher {

    async hash(text: string): Promise<string> {
        return await argon2.hash(text, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 4,
            parallelism: 2
        });
    }

}