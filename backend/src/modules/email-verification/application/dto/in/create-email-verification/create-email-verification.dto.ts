import z from "zod";

export const CreateEmailVerificationDTOSchema = z.object({
    email: z.email(),
    userId: z.uuidv7()
});

type CreateEmailVerificationDTO = z.infer<typeof CreateEmailVerificationDTOSchema>;

export default CreateEmailVerificationDTO;