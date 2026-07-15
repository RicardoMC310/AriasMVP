import UserEntity from "../../../domain/entity/user.entity.js";
import IUserHasher from "../port/hasher.port.js";
import RegisterUserUseCase from "./register.use-case.js";

describe("User registration use case tests", () => {

    it("It should register a user without issues", async () => {
        const body = {
            username: "ricardo",
            email: "ricardo@gmail.com",
            password: "Rm30042009#"
        };

        const testRepository = new TestFakeUserRepository();
        const testHasher = new TestFakeUserHasher();
        const userCase = new RegisterUserUseCase(testRepository, testHasher);

        await expect(userCase.execute(body))
            .resolves
            .not
            .toThrow();

        expect(testRepository.users).toHaveLength(1);
        expect(testRepository.users[0].username).toBe(body.username);
        expect(testRepository.users[0].email).toBe(body.email);
        expect(testRepository.users[0].passwordHash).toBe("hashed:" + body.password);
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