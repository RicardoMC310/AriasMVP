import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "node:path";
import Handlebars from "handlebars";

export default class HandlebarsMailerHtmlCompile {

    private readonly templateDir = join(
        process.cwd(),
        "src",
        "modules",
        "mailer",
        "presentation",
        "templates"
    );

    async compile(filename: string, data: Record<string, unknown>): Promise<Buffer> {
        const path = join(this.templateDir, `${filename}.hbs`);

        await access(path, constants.R_OK);

        const html = await readFile(path, "utf8");

        const template = Handlebars.compile(html);

        const result = template(data);

        return Buffer.from(result, "utf8");
    }

}