export default interface IEmailVerificationCodeGenerator {
    generator(length: number): {token: string, hash: string};
    verify(hash: string, token: string): boolean;
}