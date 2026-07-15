import Email from "../../../../core/domain/vo/email.vo.js";
import UserEntity from "../entity/user.entity.js";

export default class UserEntityBuilder {

    private _username!: string;
    private _email!: string;
    private _passwordHash!: string;

    static create(): UserEntityBuilder {
        return new UserEntityBuilder();
    }

    withUsername(username: string): this {
        this._username = username;
        return this;
    }

    withEmail(email: string): this {
        this._email = email;
        return this;
    }

    withPasswordHash(passwordHash: string): this {
        this._passwordHash = passwordHash;
        return this;
    }

    build(): UserEntity {
        return new UserEntity(
            this._username,
            Email.create(this._email),
            this._passwordHash
        );
    }

}