import Email from "../../../../core/domain/vo/email.vo.js";

export default class UserEntity {

    constructor(
        private _username: string,
        private _email: Email,
        private _passwordHash: string,
        private _id: string | null = null
    ) {}

    get username(): string {
        return this._username;
    }

    get email(): string {
        return this._email.toString();
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    get id(): string | null {
        return this._id;
    }

}