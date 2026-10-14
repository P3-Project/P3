import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export function usePizzaKitchen(){
    const queryClient = useQueryClient();
    
    const ordersQuery = useQuery({
        queryKey: ["orders", "pizza"],
        queryFn: async(): Promise<Order[]> => {
            const res = await fetch("/api/order?station=pizza");
            if(!res.ok) throw new Error("Kunne ikke hente ordrer");
            return res.json();
        },
        refetchInterval: 5000, // new orders appear automatically
    });
    const markDone = useMutation({
        mutationFn: async(orderId: number) => {
            const res = await fetch(`/api/orders/${orderId}/archive`, {method: "PATCH"});
            if(!res.ok) throw new Error("Kunne ikke markere ordren som færdig");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
    
    return {...ordersQuery, markDone};
}

/* export function usePizzaKitchen(){
    // liste af ordrer, starter tom
    return useQuery({
        queryKey: ["orders"], // cache name
        queryFn: async(): Promise<Order[]> => {
            const res = await fetch("/api/orders"); // goes through the proxy
            if(!res.ok) throw new Error("Kunne ikke hente ordre");
            return res.json();
        },
    });
} */


/* export function usePizzaKitchen() {
    // liste af ordrer, starter tom
    const [orders, setOrders] = useState<Order[]>([]);

    // når man trykker DONE: fjern ordren fra listen
    function markDone(orderId: number) {
        setOrders(orders.filter((o) => o.id !== orderId));
    }

    return { orders, markDone };
} */