import loadEnv from "../../../../platform/env/load.env.js";
import IAuthTokenGenerator from "../../application/port/token-generator.port.js";
import jwt from "jsonwebtoken";

export default class JWTAuthTokenGenerator implements IAuthTokenGenerator {

    async generateToken(id: string): Promise<string> {
        const secret = loadEnv("JWT_SECRET");

        return jwt.sign({
            user_id: id
        }, secret, { expiresIn: "15m" });
    }

}