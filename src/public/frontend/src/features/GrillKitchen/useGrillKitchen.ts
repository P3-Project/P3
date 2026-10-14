import { useQuery } from "@tanstack/react-query";

// Same shape as the JSON from Spring (adjust to match your Order entity's getters)
export type Order = {
  id: number;
  tableNumber: number;
  createdAt: string;
  // ...add the other fields your backend sends
};

export function useGrillKitchen() {
  return useQuery({
    queryKey: ["orders"],                         // cache name for orders
    queryFn: async (): Promise<Order[]> => {
      const res = await fetch("/api/orders");     // leading slash, so it goes through the Vite proxy
      if (!res.ok) throw new Error(`Server svarede med fejlstatus: ${res.status}`);
      return res.json();
    },
    refetchInterval: 5000,                        // kitchen screen: check for new orders every 5 seconds
  });
}