import InvalidEmailException from "../../../../../core/domain/exception/invalid-email.exception.js";
import UserEntity from "../../../domain/entity/user.entity.js";
import InvalidPasswordException from "../../exception/invalid-password.exception.js";
import IUserHasher from "../port/hasher.port.js";
import RegisterUserUseCase from "./register.use-case.js";

describe("User registration use case tests", () => {

    let registerUseCase: RegisterUserUseCase;
    let testUserRepository: TestFakeUserRepository;
    let testUserHasher: TestFakeUserHasher;

    beforeEach(() => {
        testUserRepository = new TestFakeUserRepository();
        testUserHasher = new TestFakeUserHasher();
        registerUseCase = new RegisterUserUseCase(testUserRepository, testUserHasher);
    });

    it("It should register a user without issues", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "Rm30042009#"
        };

        await expect(registerUseCase.execute(body))
            .resolves
            .not
            .toThrow();

        expect(testUserRepository.users).toHaveLength(1);
        expect(testUserRepository.users[0].username).toBe(body.username);
        expect(testUserRepository.users[0].email).toBe(body.email);
        expect(testUserRepository.users[0].passwordHash).toBe("hashed:" + body.password);
    });

    it("It should throw an exception if the email is invalid", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo",
            password: "Rm30042009#"
        };

        await expect(registerUseCase.execute(body)).rejects.toThrow(InvalidEmailException);

        expect(testUserRepository.users).toHaveLength(0);
    });

    it("It should throw an exception if the password is invalid", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmain.com",
            password: "Rm30"
        };

        await expect(registerUseCase.execute(body)).rejects.toThrow(InvalidPasswordException);

        expect(testUserRepository.users).toHaveLength(0);
    });

});

class TestFakeUserRepository {

    users: UserEntity[] = [];

    async save(userEntity: UserEntity): Promise<void> {
        this.users.push(userEntity);
    }

}

class TestFakeUserHasher implements IUserHasher {

    async hash(text: string): Promise<string> {
        return "hashed:" + text;
    }

}