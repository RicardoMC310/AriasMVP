import Stream from "stream";
import Email from "../../../../core/domain/vo/email.vo.js";

export type MailAttachment = {
    filename: string;
    content: Buffer | Stream | string;
    mimeType?: string;
}

export default class MailEntity {

    constructor(
        private _from: string,
        private _to: string,
        private _subject: string,
        private _body: string,
        private _attachment: MailAttachment[] = []
    ) { }

    get from(): string {
        return this._from.toString();
    }

    get to(): string {
        return this._to.toString();
    }

    get subject(): string {
        return this._subject;
    }

    get body(): string {
        return this._body;
    }

    get attachments(): MailAttachment[] {
        return this._attachment;
    }

    addAttachment(filename: string, content: Buffer | Stream | string) {
        this._attachment.push({ filename, content });
    }

}