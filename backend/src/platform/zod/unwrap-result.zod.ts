import z from "zod";

export default function unwrapZodResult<T>(result: z.ZodSafeParseResult<T>): T {
    if (!result.success) {
        const message = result.error.issues
            .map(issue => `${issue.path} - ${issue.message}`)
            .join(", ");

        throw new Error(message);
    }

    return result.data;
}