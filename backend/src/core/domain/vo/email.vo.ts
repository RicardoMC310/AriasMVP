import z from "zod";
import InvalidEmailException from "../exception/invalid-email.exception.js";

const emailSchema = z.object({
    value: z.email()
});

export default class Email {
    private _value: string;

    private constructor(value: string) {
        this._value = value;
    }

    static create(value: string): Email {
        Email.isValid(value);

        return new Email(value);
    }

    static isValid(value: string) {
        const result = emailSchema.safeParse({ value });

        if (!result.success) {
            throw new InvalidEmailException(value);
        }
    }

    toString(): string {
        return this._value;
    }

    equals(email: Email): boolean {
        return this._value === email._value;
    }
}