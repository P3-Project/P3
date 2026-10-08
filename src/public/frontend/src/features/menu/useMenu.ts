import { useQuery } from "@tanstack/react-query";

// Same shape as the JSON from the backend
export type Dish = {
    id: number;
    name: string;
    ingredients: string;
    price: number;
};

export function useMenu() {
    return useQuery({
        queryKey: ["dishes"], // cache name
        queryFn: async(): Promise<Dish[]> => {
            const res = await fetch("/api/dishes"); // goes through the proxy
            if (!res.ok) throw new Error("Kunne ikke hente menuen");
            return res.json();
        },
    });
}