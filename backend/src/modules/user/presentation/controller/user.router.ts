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
import SendMailVerificationUseCase from "../../../mailer/application/use-cases/send-mail-verification.use-case.js";
import NodemailerMailerTransporter from "../../../mailer/infrastructure/mailer-transporter/nodemailer-transporter.infra.js";
import createConnectionMailer from "../../../../platform/mail/mailer.connection.js";
import loadEnv from "../../../../platform/env/load.env.js";
import HandlebarsMailerHtmlCompile from "../../../mailer/infrastructure/html-compiler/handlebars-html-compile.infra.js";
import Email from "../../../../core/domain/vo/email.vo.js";

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

    const transporter = createConnectionMailer();
    const mailerTransporter = new NodemailerMailerTransporter(transporter);
    const handlebarsHtmlCompile = new HandlebarsMailerHtmlCompile();
    const mailerSender = new SendMailVerificationUseCase(
        mailerTransporter,
        {
            name: loadEnv("SMTP_FROM_NAME"),
            address: Email.create(loadEnv("SMTP_FROM"))
        },
        handlebarsHtmlCompile
    );

    const kyselyEmailVerificationRepository = new KyselyEmailVerificationRepository(db);
    const emailVerificationCodeGenerator = new EmailVericationCodeGenerator();
    const createEmailVerificationUseCase = new CreateEmailVerificationUseCase(
        emailVerificationCodeGenerator, 
        kyselyEmailVerificationRepository
    );

    createEmailVerificationUseCase.registerObserver(mailerSender);

    const kyselyUserRespository = new KyselyUserRepository(db);
    const argonUserHasher = new ArgonUserHasher();
    const registerUserUseCase = new RegisterUserUseCase(
        kyselyUserRespository, 
        argonUserHasher, 
    );

    registerUserUseCase.registerObserver(createEmailVerificationUseCase);

    const controller = new UserController(
        registerUserUseCase
    );

    return controller;
}