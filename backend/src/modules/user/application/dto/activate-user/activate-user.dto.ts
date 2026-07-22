import z from "zod";

export const ActivateUserDTOSchema = z.object({
    userId: z.uuidv7()
});

type ActivateUserDTO = z.infer<typeof ActivateUserDTOSchema>;

export default ActivateUserDTO;