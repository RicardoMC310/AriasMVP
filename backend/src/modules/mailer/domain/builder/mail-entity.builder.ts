import Email from "../../../../core/domain/vo/email.vo.js";
import MailEntity, { MailAttachment } from "../entities/mail.entity.js";

export default class MailEntityBuilder {

    private _from!: string;
    private _to!: string;
    private _subject!: string;
    private _body!: string;
    private _attachments: MailAttachment[] = [];

    static create(): MailEntityBuilder {
        return new MailEntityBuilder();
    }

    withFrom(from: string): this {
        this._from = from;
        return this;
    }

    withTo(to: string): this {
        this._to = to;
        return this;
    }

    withSubject(subject: string): this {
        this._subject = subject;
        return this;
    }

    withBody(body: string): this {
        this._body = body;
        return this;
    }

    withAttachments(attachements: MailAttachment[]): this {
        this._attachments = attachements;
        return this;
    }

    build(): MailEntity {
        return new MailEntity(
            this._from,
            this._to,
            this._subject,
            this._body,
            this._attachments
        );
    }

}