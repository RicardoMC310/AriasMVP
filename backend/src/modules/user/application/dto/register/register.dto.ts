import z from "zod";


export const RegisterUserDTOSchema = z.object({
    username: z.string().min(3).max(64),
    email: z.email(),
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/,
        {
            message: "The password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
        }
    )
});

type RegisterUserDTO = z.infer<typeof RegisterUserDTOSchema>;

export default RegisterUserDTO;