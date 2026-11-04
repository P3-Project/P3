import { useQuery } from "@tanstack/react-query";

// --- Types: mirror OrderDto / OrderItemDto in OrderDtos.java

export type OrderStatus = "OPEN" | "CLOSED" | "CANCELLED";

export type OrderItemDto = {
    orderItemId: number;
    itemId: number;
    name: string;
    price: number;
    quantity: number;
    note: string | null;
    sentAt: string | null;
    voidedAt: string | null; // set when the waiter removed it AFTER it was sent. Still saved, but not billed.
    completed: boolean;
};

export type OrderDto = {
    orderId: number;
    tableNumber: number;
    waiterId: number;
    waiterName: string;
    status: OrderStatus;
    createdAt: string;
    closedAt: string | null;
    cancelledAt: string | null;
    total: number;
    items: OrderItemDto[];
};

// API + hook

// GET /api/orders/history?days=30 -> every order from the last 30 days, newest first
export function useOrderHistory(days: number){
    return useQuery({
        queryKey: ["orders", "history", days],
        queryFn: async (): Promise<OrderDto[]> => {
            const res = await fetch(`/api/orders/history?days=${days}`);
            if(!res.ok) throw new Error("Kunne ikke hente ordrehistorikken");
            return res.json();
        },
    });
}

// Helpers
const dayKeyFormat = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Copenhagen"}); // "2026-10-29"
const timeFormat = new Intl.DateTimeFormat("da-DK", { timeZone: "Europe/Copenhagen", hour: "2-digit", minute: "2-digit" });
const dayLabelFormat = new Intl.DateTimeFormat("da-DK", { timeZone: "Europe/Copenhagen", weekday: "long", day: "numeric", month: "long" });

export const formatClock = (iso: string) => timeFormat.format(new Date(iso)); // "18:42"

// "I dag", "I går" or "tirsdag 27. oktober"
export function dayLabel(dayKey: string) {
  const today = dayKeyFormat.format(new Date());
  const yesterday = dayKeyFormat.format(new Date(Date.now() - 86_400_000));
  if (dayKey === today) return "I dag";
  if (dayKey === yesterday) return "I går";
  const label = dayLabelFormat.format(new Date(`${dayKey}T12:00:00`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// Newest-first list -> [{ dayKey, orders }] per Danish calendar day, newest day first
export function groupByDay(orders: OrderDto[]) {
  const days = new Map<string, OrderDto[]>();
  for (const order of orders) {
    const key = dayKeyFormat.format(new Date(order.createdAt));
    days.set(key, [...(days.get(key) ?? []), order]);
  }
  return [...days].map(([dayKey, list]) => ({ dayKey, orders: list }));
}