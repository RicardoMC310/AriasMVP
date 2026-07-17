import JWTAuthTokenGenerator from "../../../modules/auth/infrastructure/token-generator/jwt-token-generator.infra.js";

export default function authTokenGeneratorFactory() {
    return new JWTAuthTokenGenerator();
}