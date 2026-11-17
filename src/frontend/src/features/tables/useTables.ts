import { useQuery } from "@tanstack/react-query";

export type RestaurantTable = {
    tableNumber: number;
    seats: number;
};

export function useTables(){
    return useQuery({
        queryKey: ["tables"], // different cache name than "dishes"
        queryFn: async (): Promise<RestaurantTable[]> =>{
            const res = await fetch("/api/tables"); // through the Vite proxy to Spring
            if (!res.ok) throw new Error("Kunne ikke hente bordene");
            return res.json();
        },
    });
}