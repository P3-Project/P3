import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ---------- Types: mirror KitchenItemDto in OrderDtos.java ----------

export type Station = "PIZZA" | "GRILL";

export type KitchenItem = {
  orderItemId: number;
  orderId: number;
  tableNumber: number;
  name: string;
  station: Station;
  quantity: number;
  note: string | null; // allergies, "medium rare", ...
  sentAt: string; // ISO timestamp, used only for sorting (oldest first)
};

// One ticket on the board = all pending dishes from one order (one table)
export type Ticket = {
  orderId: number;
  tableNumber: number;
  items: KitchenItem[];
};

// ---------- API calls ----------

// GET /api/kitchen            -> everything not done yet
// GET /api/kitchen?station=X  -> only dishes for that station
async function getQueue(station?: Station): Promise<KitchenItem[]> {
  const res = await fetch(station ? `/api/kitchen?station=${station}` : "/api/kitchen");
  if (!res.ok) throw new Error("Kunne ikke hente køkkenets ordrer");
  return res.json();
}

// POST /api/kitchen/items/{id}/complete -> 204, the dish is archived
async function completeItem(orderItemId: number) {
  const res = await fetch(`/api/kitchen/items/${orderItemId}/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Kunne ikke markere retten som færdig");
}

// ---------- Hooks ----------

const kitchenKey = (station?: Station) => ["kitchen", station ?? "ALL"] as const;

// The queue, refreshed every 5 seconds so new orders from the waiters show up by themselves
export function useKitchenQueue(station?: Station) {
  return useQuery({
    queryKey: kitchenKey(station),
    queryFn: () => getQueue(station),
    refetchInterval: 5000,
  });
}

// Mark dishes as done. "Optimistic": the dish disappears from the screen immediately,
// and comes back only if the server says no. Feels instant on the iPad.
export function useCompleteItems() {
  const queryClient = useQueryClient();

  return useMutation({
    // Several ids at once, so "Alt færdig" on a ticket is one tap
    mutationFn: (ids: number[]) => Promise.all(ids.map(completeItem)),

    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ["kitchen"] }); // stop a refresh from overwriting us
      const before = queryClient.getQueriesData<KitchenItem[]>({ queryKey: ["kitchen"] });
      // Remove the dishes from every kitchen list (Oversigt, Pizza, Grill)
      queryClient.setQueriesData<KitchenItem[]>({ queryKey: ["kitchen"] }, (items) =>
        items?.filter((item) => !ids.includes(item.orderItemId)),
      );
      return { before }; // remembered so we can undo
    },
    onError: (_error, _ids, context) => {
      // Put the lists back the way they were
      context?.before.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["kitchen"] }), // fetch the truth again
  });
}

// ---------- Cancelled dishes (the waiter removed a dish that had been in the kitchen a while) ----------

// Mirrors KitchenVoidDto in OrderDtos.java
export type VoidNotice = {
  orderItemId: number;
  orderId: number;
  tableNumber: number;
  name: string;
  station: Station;
  quantity: number;
  note: string | null;
  sentAt: string;
  voidedAt: string;
};

// GET /api/kitchen/voided -> cancellations the kitchen hasn't confirmed yet
export function useVoidNotices(station?: Station) {
  return useQuery({
    queryKey: ["kitchen", "voided", station ?? "ALL"],
    queryFn: async (): Promise<VoidNotice[]> => {
      const res = await fetch(station ? `/api/kitchen/voided?station=${station}` : "/api/kitchen/voided");
      if (!res.ok) throw new Error("Kunne ikke hente annulleringer");
      return res.json();
    },
    refetchInterval: 5000, // same rhythm as the queue, so the notice shows up at the same time the dish disappears
  });
}

// POST /api/kitchen/items/{id}/acknowledge -> "OK, set". The notice disappears right away (optimistic).
export function useAcknowledgeVoid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderItemId: number) => {
      const res = await fetch(`/api/kitchen/items/${orderItemId}/acknowledge`, { method: "POST" });
      if (!res.ok) throw new Error("Kunne ikke bekræfte");
    },
    onMutate: (orderItemId) => {
      queryClient.setQueriesData<VoidNotice[]>({ queryKey: ["kitchen", "voided"] }, (list) =>
        list?.filter((n) => n.orderItemId !== orderItemId),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["kitchen", "voided"] }),
  });
}

// ---------- Helpers ----------

// Flat list of dishes -> tickets per order, oldest ticket first (the list is already oldest first)
export function groupIntoTickets(items: KitchenItem[]): Ticket[] {
  const tickets = new Map<number, Ticket>();
  for (const item of items) {
    const ticket = tickets.get(item.orderId) ?? { orderId: item.orderId, tableNumber: item.tableNumber, items: [] };
    ticket.items.push(item);
    tickets.set(item.orderId, ticket);
  }
  return [...tickets.values()];
}