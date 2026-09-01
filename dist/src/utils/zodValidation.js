import { AppError } from "./globalHandler.js";
export const validateSchema = (data, schema) => {
    const result = schema.safeParse(data);
    if (!result.success)
        throw new AppError(422, "Invalid input");
    return result.data;
};
