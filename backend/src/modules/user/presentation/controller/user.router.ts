import express from "express";
import { HttpController } from "../../../../platform/express/http-controller.express.js";
import UserController from "./user.controller.js";
import RegisterUserUseCase from "../../application/use-cases/register/register.use-case.js";
import KyselyUserRepository from "../../infrastructure/database/kysely.infra.js";
import ArgonUserHasher from "../../infrastructure/hasher/argon2.infra.js";
import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";

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
    const kyselyUserRespository = new KyselyUserRepository(db);
    const argonUserHasher = new ArgonUserHasher();
    const registerUserUseCase = new RegisterUserUseCase(kyselyUserRespository, argonUserHasher);

    const controller = new UserController(
        registerUserUseCase
    );

    return controller;
}