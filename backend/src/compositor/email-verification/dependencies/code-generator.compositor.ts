import EmailVericationCodeGenerator from "../../../modules/email-verification/infrastructure/code/code-generator.infra.js";

export default function emailVerificationCodeGeneratorFactory() {
    return new EmailVericationCodeGenerator();
}