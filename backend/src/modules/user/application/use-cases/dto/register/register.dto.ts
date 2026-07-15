import z from "zod";

export const RegisterUserDTOSchema = z.object({
    username: z.string().min(3).max(64),
    email: z.email(),
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
        {
            message: "Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial"
        }
    )
});

type RegisterUserDTO = z.infer<typeof RegisterUserDTOSchema>;

export default RegisterUserDTO;