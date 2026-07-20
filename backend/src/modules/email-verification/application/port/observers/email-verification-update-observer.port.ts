export default interface IEmailVerificationUpdateObserver {
    execute(dto: {email: string, token: string}): Promise<void>;
}