import IUserHasher from "../../application/port/hasher.port.js";

export default class TestFakeUserHasher implements IUserHasher {

    async hash(text: string): Promise<string> {
        return "hashed:" + text;
    }

}