// Reuse the real types instead of keeping our own copies.
// If the backend changes a field, there is only one place to update.
export type { MenuItem } from "@/features/menu/types";
export type { RestaurantTable } from "@/features/tables/useTables";

// One line on an order, e.g. "2 × Margherita, uden løg". Comes straight from the backend now
// (OrderItemDto in OrderDtos.java) instead of living only in the browser.
export type { OrderItemDto as OrderLine, OrderDto } from "@/features/orders/history";