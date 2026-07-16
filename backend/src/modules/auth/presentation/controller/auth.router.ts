import express, { Router } from "express";
import { HttpController } from "../../../../platform/express/http-controller.express.js";
import AuthController from "./auth.controller.js";
import AuthLoginUseCase from "../../application/use-case/login/login.use-case.js";
import { Kysely } from "kysely";
import { DB } from "../../../../platform/database/db.js";
import KyselyUserRepository from "../../../user/infrastructure/database/kysely.infra.js";
import FindUserByEmailUseCase from "../../../user/application/use-cases/find-by-email/find-by-email.use-case.js";
import ArgonAuthHasher from "../../infrastructure/hasher/argon.infra.js";
import JWTAuthTokenGenerator from "../../infrastructure/token-generator/jwt-token-generator.infra.js";

export default function makeAuthRouter(db: Kysely<DB>): HttpController {
    const authController = buildController(db);

    const router: Router = express.Router();

    router.post("/login", authController.login);

    return {
        router,
        prefix: "/auth"
    }
}

function buildController(db: Kysely<DB>): AuthController {
    const userRepository = new KyselyUserRepository(db);
    const findUserByEmail = new FindUserByEmailUseCase(userRepository);

    const argonAuthHasher = new ArgonAuthHasher();
    const jwtAuthTokenGenerator = new JWTAuthTokenGenerator();
    const authLoginUseCase = new AuthLoginUseCase(findUserByEmail, argonAuthHasher, jwtAuthTokenGenerator);

    const controller = new AuthController(authLoginUseCase);

    return controller;
}