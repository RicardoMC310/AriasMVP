export default interface UserRegisterObserver {
    execute(dto: {email: string, userId: string}): Promise<void>;
}