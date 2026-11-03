import type { MenuItem } from "@/features/menu/types";
export type { MenuItem } from "@/features/menu/types";
export type { RestaurantTable } from "@/features/tables/types";

// Én linje på en ordre, fx "2 × Margherita, uden løg"
export type OrderLine = {
  lineId: number;
  item: MenuItem;
  quantity: number;
  note: string;
  sentAt: string | null; // null = ikke sendt til køkkenet endnu
};
