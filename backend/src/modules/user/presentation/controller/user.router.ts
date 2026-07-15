import express from "express";
import { HttpController } from "../../../../platform/express/http-controller.express.js";
import UserController from "./user.controller.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import KyselyUserRepository from "../../infrastructure/database/kysely.infra.js";
import ArgonUserHasher from "../../infrastructure/hasher/argon2.infra.js";

export default function makeUserRouter(): HttpController {
    const userController = buildController();

    const router = express.Router();

    router.post("/register", userController.register);

    return {
        router,
        prefix: "/user"
    }
}

function buildController(): UserController {
    const kyselyUserRespository = new KyselyUserRepository();
    const argonUserHasher = new ArgonUserHasher();
    const registerUserUseCase = new RegisterUserUseCase(kyselyUserRespository, argonUserHasher);

    const controller = new UserController(
        registerUserUseCase
    );

    return controller;
}