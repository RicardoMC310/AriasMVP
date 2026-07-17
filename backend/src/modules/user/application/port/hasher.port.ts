export default interface IUserHasher {
    hash(text: string): Promise<string>;
}