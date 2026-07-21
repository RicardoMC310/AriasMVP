export default interface IEmailVerificationVerifyObserver {
    execute(userId: string): Promise<void>;
}