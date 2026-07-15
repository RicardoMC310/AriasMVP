import InvalidEmailException from "../exception/invalid-email.exception.js";
import Email from "./email.vo.js";

describe("Email Value Object Test", () => {

    it("It must return the content unchanged", () => {
        const emailRaw = "ricardo@gmail.com";

        const email = Email.create(emailRaw);

        expect(email.toString()).toBe(emailRaw);
    });

    it("It should throw an error if an invalid email is passed", () => {
        const emailRaw = "ricardo";

        expect(() => Email.create(emailRaw)).toThrow(InvalidEmailException);
    });

});