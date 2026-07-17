import z from "zod";

export const SendEmailVerificationDTOSchema = z.object({
    email: z.email(),
    token: z.string().min(1)
});

type SendEmailVerificationDTO = z.infer<typeof SendEmailVerificationDTOSchema>;

export default SendEmailVerificationDTO;