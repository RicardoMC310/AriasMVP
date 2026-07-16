import createMailpitContainer from "../containers/mailpit.container";
import { TestService } from "../integration-environments";

export default async function upMailpit(): Promise<TestService> {
    console.log("Preparing integration server smtp...");

    const mailpitContainer = await createMailpitContainer();
    const host = mailpitContainer.host;
    const port = mailpitContainer.port;

    return {
        container: mailpitContainer.container,
        variables: [
            { name: "SMTP_HOST", value: host },
            { name: "SMTP_PORT", value: port.toString() }
        ]
    }
}