import z from "zod";

export const ResendEmailVerificationDTOSchema = z.object({
    email: z.email()
});

type ResendEmailVerificationDTO = z.infer<typeof ResendEmailVerificationDTOSchema>;

export default ResendEmailVerificationDTO;