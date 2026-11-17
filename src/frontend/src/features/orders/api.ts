import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { OrderDto, OrderItemDto } from "./history";

// TODO: take this from the logged-in staff member once login is connected
// 2 = Mads Nielsen (S002) in the test data.
export const CURRENT_WAITER_ID = 2;

// Raw calls to OrderController. Every write returns the whole, updated order.
async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
    const res = await fetch(`/api/orders${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        // OrderService throws Danish messages like "Moro er udsolgt". Show them if Spring sends them along
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || `Serverfejl (${res.status})`);
    }
    return res.json();
}

const api = {
    open: () => request<OrderDto[]>("?open=true"),
    create: (tableNumber: number) => request<OrderDto>("", "POST", { tableNumber, waiterId: CURRENT_WAITER_ID }),
    addItem: (orderId: number, itemId: number) => request<OrderDto>(`/${orderId}/items`, "POST", { itemId, quantity: 1, note: null }),
    updateItem: (orderId: number, line: OrderItemDto, quantity: number, note: string | null) =>
        request<OrderDto>(`/${orderId}/items/${line.orderItemId}`, "PUT", { quantity, note }),
    removeItem: (orderId: number, line: OrderItemDto) => request<OrderDto>(`/${orderId}/items/${line.orderItemId}`, "DELETE"),
    send: (orderId: number) => request<OrderDto>(`/${orderId}/send`, "POST"),
    close: (orderId: number) => request<OrderDto>(`/${orderId}/close`, "POST"),
    cancel: (orderId: number) => request<OrderDto>(`/${orderId}/cancel`, "POST"),
    // A SENT dish can't be deleted (the kitchen may be making it), so it's marked as cancelled instead
    voidItem: (orderId: number, line: OrderItemDto) => request<OrderDto>(`/${orderId}/items/${line.orderItemId}/void`, "POST"),
};

// Hooks
const OPEN_KEY = ["orders", "open"] as const;

export function useOpenOrders() {
    return useQuery({ queryKey: OPEN_KEY, queryFn: api.open, refetchInterval: 10_000 });
}


// Everything the waiter can do to ONE table's order.
// `order` is null until the first dish is added: the order is only created in the database
// so tapping a table and going back doesn't leave empty orders behind.
export function useTableOrder(tableNumber: number){
    const queryClient = useQueryClient();
    const openOrders = useOpenOrders();
    const order = openOrders.data?.find((o) => o.tableNumber === tableNumber) ?? null;

    // If the waiter taps 3 dishes quickly on an empty table, all 3 must land on ONE new order.
    // So the "create order" request is remembered here and reused while it's on its way
    const creating = useRef<Promise<OrderDto> | null>(null);

    // Put the order the server sent back into the cache -> the screen updates without waiting for a refresh
    function store(updated: OrderDto){
        queryClient.setQueryData<OrderDto[]>(OPEN_KEY, (list = []) => {
            const others = list.filter((o) => o.orderId !== updated.orderId);
            return updated.status === "OPEN" ? [...others, updated] : others;
        });
        if (updated.status !== "OPEN") creating.current = null;
    }

    // One mutation runs every action, so there's a single place for "saving..." and error messages
    const mutation = useMutation({
        mutationFn: (action: () => Promise<OrderDto>) => action(),
        onSuccess: store,
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["kitchen"] });
            queryClient.invalidateQueries({ queryKey: ["orders", "history"] });
        },
    });
    const run = (action: () => Promise<OrderDto>) => mutation.mutate(action);

    async function ensureOrder(): Promise<OrderDto> {
        if (order) return order;
        // If creating fails (server down, table already taken), forget it so the next tap
        creating.current ??= api.create(tableNumber).catch((error) => {
            creating.current = null;
            throw error;
        });
        return creating.current;
    }

    // If an order ends up with no dishes at all, cancel it so the table is free again
    async function cancelIfEmpty(updated: OrderDto){
        return updated.items.length === 0 ? api.cancel(updated.orderId) : updated;
    }

    return {
        order,
        lines: order?.items ?? [],
        isLoading: openOrders.isPending,
        isSaving: mutation.isPending,
        error: mutation.error?.message ?? null,

        add: (itemId: number) => 
            run(async () => {
                const current = await ensureOrder();
                return api.addItem(current.orderId, itemId);
            }),

        changeQuantity: (line: OrderItemDto, delta: number) =>
            order &&
            run(async () => {
                const quantity = line.quantity + delta;
                if(quantity <= 0) return cancelIfEmpty(await api.removeItem(order.orderId, line));
                return api.updateItem(order.orderId, line, quantity, line.note);
            }),

        setNote: (line: OrderItemDto, note: string) =>
            order && run(() => api.updateItem(order.orderId, line, line.quantity, note.trim() || null)),

        remove: (line: OrderItemDto) => order && run(async () => cancelIfEmpty(await api.removeItem(order.orderId, line))),
        
        // Remove a dish that was already sent. It disappears from the kitchen screen, if it had been there
        // a while, the kitchen gets a notice. It stays in the database (marked cancelled) for the history.
        voidLine: (line: OrderItemDto) => order && run(() => api.voidItem(order.orderId, line)),

        // "Annullér": remove everything that hasn't been sent yet (sent dishes stay, the kitchen is making them)
        removeUnsent: () =>
      order &&
      run(async () => {
        let updated = order;
        for (const line of order.items.filter((l) => l.sentAt === null)) {
          updated = await api.removeItem(order.orderId, line);
        }
        return cancelIfEmpty(updated);
      }),

        send: () => order && run(() => api.send(order.orderId)),

        close: () => order && run(() => api.close(order.orderId)),
    };
}