import IAuthHasher from "../../application/port/hasher.port.js";
import argon from "argon2";

export default class ArgonAuthHasher implements IAuthHasher {

    async verify(hash: string, text: string): Promise<boolean> {
        return await argon.verify(hash, text);
    }

}