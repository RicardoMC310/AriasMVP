import Email from "../../../../core/domain/vo/email.vo.js";

export enum UserState {
    VERIFICATION_PENDING = "VERIFICATION_PENDING",
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
};

export default class UserEntity {

    constructor(
        private _username: string,
        private _email: Email,
        private _passwordHash: string,
        private _id: string | null = null,
        private _state: UserState = UserState.VERIFICATION_PENDING
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

    get state(): UserState {
        return this._state;
    }

}