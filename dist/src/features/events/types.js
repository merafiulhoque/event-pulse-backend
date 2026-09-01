import z from "zod";
export const EventCreateSchema = z.object({
    name: z.string().trim().min(3, "Min 3 characters Required"),
    place: z.string().trim().min(3, "Min 3 characters Required"),
    date: z.string().date(),
    time: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    capacity: z.number().min(1, "Min 1 is required"),
    bookingStartDate: z.string().date(),
    bookingStartTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    bookingEndDate: z.string().date(),
    bookingEndTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});
