import Email from "../../../../core/domain/vo/email.vo.js";

export default interface IMailerConfigutation {
    name: string;
    address: Email;
}