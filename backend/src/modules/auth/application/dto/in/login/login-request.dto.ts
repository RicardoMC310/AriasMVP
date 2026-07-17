import z from "zod";

export const AuthLoginRequestDTOSchema = z.object({
    email: z.email(),
    password: z.string().min(1)
});

type AuthLoginRequestDTO = z.infer<typeof AuthLoginRequestDTOSchema>;

export default AuthLoginRequestDTO;