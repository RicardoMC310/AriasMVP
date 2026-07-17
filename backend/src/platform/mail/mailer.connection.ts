import nodemailer from "nodemailer";
import loadEnv from "../env/load.env.js";

export default function createConnectionMailer(): nodemailer.Transporter {
    const transporter = nodemailer.createTransport({
        host: loadEnv("SMTP_HOST"),
        port: Number(loadEnv("SMTP_PORT")),
        secure: loadEnv("SMTP_SECURE") === "true",
        auth: {
            user: loadEnv("SMTP_USER", ""),
            pass: loadEnv("SMTP_KEY", "")
        }
    });

    return transporter;
}