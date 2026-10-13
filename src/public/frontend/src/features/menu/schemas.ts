import { z } from "zod";

export const menuItemFormSchema = z.object({
    name: z.string().trim().min(1, "Navn er påkrævet"),
    price: z.coerce.number().int("Pris skal være et helt tal").positive("Pris skal være et positivt tal"),
    dishDescription: z.string().trim().optional(),
    category: z.string().trim().min(1, "Kategori er påkrævet"),
    station: z.enum(["PIZZA", "GRILL"]),
    outOfStock: z.boolean(),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;