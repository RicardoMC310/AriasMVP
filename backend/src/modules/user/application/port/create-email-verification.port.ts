import CreateEmailVerificationDTO from "../../../email-verification/application/dto/in/create-email-verification/create-email-verification.dto.js";

export default interface IUserCreateEmailVerificationUseCase {
    execute(dto: CreateEmailVerificationDTO): Promise<void>;
}