import HandlebarsMailerHtmlCompile from "../../platform/html-compiler/handlebars-html-compile.infra.js";

export default function mailerHtmlCompileFactory() {
    return new HandlebarsMailerHtmlCompile();
}