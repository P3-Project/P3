import { useGrillKitchen } from './useGrillKitchen';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function GrillKitchenView() {
    const {orders, loading} = useGrillKitchen();
    if (loading) {
        return <div className="p-4 text-white">Indlæser grillkøkken overblik...</div>;
    }
    return(
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Grill Køkken Oversigt</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order: any) => (
            <Card key={order.id} className="bg-zinc-900 border-zinc-800 text-white">
            <CardContent>
                <ul className="space-y-2">
                    {order.items?.map((item: any, index: number) => (
                        <li key={index} className="border-b border-zinc-800 pb-2">
                            <span className="font-semibold">{item.quantity}x {item.name}</span>
                            {item.notes && <p className="text-sm text-yellow-400">Note: {item.notes}</p>}
                        </li>
                    ))}
                </ul>
            </CardContent>
            </Card>
    ))}
    </div>
    </div>
    );
}
