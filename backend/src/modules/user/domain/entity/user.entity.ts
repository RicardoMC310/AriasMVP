import Email from "../../../../core/domain/vo/email.vo.js";
import UserCannotTransitionStateException from "../exception/cannot-transition-state.exception.js";

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
        private _id: string,
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

    get id(): string {
        return this._id;
    }

    get state(): UserState {
        return this._state;
    }

    verifyEmail() {
        if (this._state !== UserState.VERIFICATION_PENDING)
            throw new UserCannotTransitionStateException(this._state, UserState.ACTIVE);

        this._state = UserState.ACTIVE;
    }

    block() {
        this._state = UserState.BLOCKED;
    }

}