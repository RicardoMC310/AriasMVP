export default interface IEmailVerificationVerifyObserver {
    execute(dto: {userId: string}): Promise<void>;
}