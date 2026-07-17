export default interface IAuthTokenGenerator {
    generateToken(id: string): Promise<string>;
}