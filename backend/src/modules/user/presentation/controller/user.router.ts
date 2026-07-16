import express from "express";
import { HttpController } from "../../../../platform/express/http-controller.express.js";
import UserController from "./user.controller.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import KyselyUserRepository from "../../infrastructure/database/kysely.infra.js";
import ArgonUserHasher from "../../infrastructure/hasher/argon2.infra.js";
import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import CreateEmailVerificationUseCase from "../../../email-verification/application/use-cases/create-email-verification/create-email-verification.use-case.js";
import KyselyEmailVerificationRepository from "../../../email-verification/infrastructure/database/kysely.infra.js";
import EmailVericationCodeGenerator from "../../../email-verification/infrastructure/code/code-generator.infra.js";

export default function makeUserRouter(db: Kysely<DB>): HttpController {
    const userController = buildController(db);

    const router = express.Router();

    router.post("/register", userController.register);

    return {
        router,
        prefix: "/user"
    }
}

function buildController(db: Kysely<DB>): UserController {
    const kyselyEmailVerificationRepository = new KyselyEmailVerificationRepository(db);
    const emailVerificationCodeGenerator = new EmailVericationCodeGenerator();
    const createEmailVerificationUseCase = new CreateEmailVerificationUseCase(
        emailVerificationCodeGenerator, 
        kyselyEmailVerificationRepository
    );

    const kyselyUserRespository = new KyselyUserRepository(db);
    const argonUserHasher = new ArgonUserHasher();
    const registerUserUseCase = new RegisterUserUseCase(
        kyselyUserRespository, 
        argonUserHasher, 
        createEmailVerificationUseCase
    );

    const controller = new UserController(
        registerUserUseCase
    );

    return controller;
}