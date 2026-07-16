export default interface IAuthHasher {
    verify(hash: string, text: string): Promise<boolean>;
}