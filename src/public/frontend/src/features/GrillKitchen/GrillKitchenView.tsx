import { useGrillKitchen } from "@/features/GrillKitchen/useGrillKitchen";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function GrillKitchenView() {
    const { data: orders, isLoading, error } = useGrillKitchen();

    if (isLoading) return <p>Indlæser ordrer...</p>;
    if (error) return <p>Fejl: {error.message}</p>;
    if (!orders?.length) return <p>Ingen ordrer endnu</p>;   // empty list is not an error

    return (
    <ul>
        {orders.map((order) => (
        <li key={order.id}>Bord {order.tableNumber}</li>
        ))}
    </ul>
    );
}
