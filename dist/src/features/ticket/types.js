import z from "zod";
export const TicketBookingSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be minimum 3 character")
        .transform((name) => name
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase())
        .join(" ")),
    email: z
        .string()
        .email("This is not a valid email")
        .trim()
        .toLowerCase(),
    phone: z
        .string()
        .trim()
        .regex(/^[6-9]\d{9}$/, "Phone number must be exactly 10 digits"),
});
