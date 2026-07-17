export default interface EmailVerificationObserver {
    execute(dto: {email: string, token: string}): Promise<void>;
}