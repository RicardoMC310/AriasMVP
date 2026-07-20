import z from "zod";

export const VerifyEmailVerificationRequestDTOSchema = z.object({
    email: z.email(),
    token: z.string().min(8).max(8)
});

type VerifyEmailVerificationRequestDTO = z.infer<typeof VerifyEmailVerificationRequestDTOSchema>;

export default VerifyEmailVerificationRequestDTO;