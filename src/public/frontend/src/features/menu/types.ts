export type Station = "PIZZA" | "GRILL";

export type MenuItem = {
    itemId: number;
    dishNumber: string | null;
    name: string;
    price: number;
    dishDescription: string | null;
    station: Station;
    outOfStock: boolean;
    category: string;
    prepTime: number | null;
};