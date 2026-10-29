//import "bootstrap/dist/css/bootstrap.min.css";
import "@/features/kitchen/kitchen.css";
import { useKitchen } from "@/features/kitchen/useKitchen";

type Props = {
    station: "PIZZA" | "GRILL";   // here the union IS correct: it's a type
    title: string;
};

// The ticket list for one station. Used by the pizza, grill and overview screens.
export function KitchenBoard({ station, title }: Props) {
    const { data: orders, markDone, isLoading, error } = useKitchen(station);

    if (isLoading) return <p>Indlæser ordrer...</p>;
    if (error) return <p>Fejl: {error.message}</p>;

    return (
        <section>
            <h1>{title}</h1>
            <p>{orders?.length} åbne ordrer</p>

            {/* et kort for hver ordre */}
            {orders?.map((order) => (
                <div key={order.orderId}>
                    <h2>Bord {order.tableNumber}</h2>

                    {order.items.map((item) => (
                        <div key={item.orderItemId}>
                            <p>{item.quantity}x {item.name}</p>
                            {/* noten vises kun, hvis der er en */}
                            {item.note && <small>+ {item.note}</small>}
                        </div>
                    ))}

                    <button
                        onClick={() => markDone.mutate(order.items.map((i) => i.orderItemId))}
                        disabled={markDone.isPending}
                    >
                        DONE
                    </button>
                </div>
            ))}
        </section>
    );
}