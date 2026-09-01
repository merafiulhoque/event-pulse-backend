import z from "zod";
export const OrganizerCreateSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be minimum 3 character")
        .transform(name => name
        .split(/\s+/)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ")),
    email: z.string().email("This is not a valid email").trim().toLowerCase(),
    password: z.string().min(6, "Min 6 character")
});
export const OrganizerLoginSchema = z.object({
    email: z.string().email("This is not a valid email").trim().toLowerCase(),
    password: z.string().min(6, "Min 6 character")
});
