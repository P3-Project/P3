import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type KitchenItem = {
    orderItemId: number;
    orderId: number;
    tableNumber: number;
    name: string;
    station: string;
    quantity: number;
    note: string | null;
    sentAt: string;
};


export type Ticket = { orderId: number; tableNumber: number; items: KitchenItem[] };

function groupIntoTickets(items: KitchenItem[]): Ticket[]{
    const byOrder = new Map<number, Ticket>();
    for (const item of items){
        if(!byOrder.has(item.orderId)){
            byOrder.set(item.orderId, { orderId: item.orderId, tableNumber: item.tableNumber, items: [] });
        }
        byOrder.get(item.orderId)!.items.push(item);
    }
    return[...byOrder.values()];
}


export function useKitchen(station: "PIZZA" | "GRILL"){
    const queryClient = useQueryClient();
    
    const ordersQuery = useQuery({
        queryKey: ["kitchen", station],
        queryFn: async(): Promise<KitchenItem[]> => {
            const res = await fetch(`/api/kitchen?station=${station}`);
            if(!res.ok) throw new Error("Kunne ikke hente ordrer");
            return res.json();
        },
        select: groupIntoTickets,
        refetchInterval: 5000, // new orders appear automatically
    });
    const markDone = useMutation({
        mutationFn: async (orderItemIds: number[]) => {
        // One request per item: [5, 6] → /api/kitchen/items/5/complete and /api/kitchen/items/6/complete
        await Promise.all(orderItemIds.map(async (id) => {
            const res = await fetch(`/api/kitchen/items/${id}/complete`, { method: "POST" });
            if (!res.ok) throw new Error("Kunne ikke markere retten som færdig");
        }));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
    
    return {...ordersQuery, markDone};
}
