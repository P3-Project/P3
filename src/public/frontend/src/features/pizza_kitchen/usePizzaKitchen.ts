import { useState } from "react";

export type OrderItem = {
    id: number;
    name: string;
    quantity: number;
    note: string;
};

export type Order = {
    id: number;
    tableNumber: number;
    items: OrderItem[];
};

export function usePizzaKitchen() {
    // liste af ordrer, starter tom
    const [orders, setOrders] = useState<Order[]>([]);

    // når man trykker DONE: fjern ordren fra listen
    function markDone(orderId: number) {
        setOrders(orders.filter((o) => o.id !== orderId));
    }

    return { orders, markDone };
}