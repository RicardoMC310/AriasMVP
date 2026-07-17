export default interface IMailerHtmlCompile {
    compile(filename: string, data: Record<string, unknown>): Promise<Buffer>;
}