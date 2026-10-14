import { useKitchen } from "../../features/kitchen/useKitchen";

export default function PizzaScreen() {
    // hent ordrer og DONE-funktionen
    const { data: orders, markDone, isLoading, error } = useKitchen("PIZZA");

    if(isLoading) return <p>Indlæser ordrer...</p>
    if(error) return <p>Fejl: {error.message}</p>

    return (
        <main className="min-h-svh p-8">
            <div>
                <h1>PIZZA KITCHEN</h1>
                <p>{orders?.length} åbne ordrer</p>

                {/* et kort for hver ordre */}
                {orders?.map((order) => (
                    <div key={order.orderId}>
                        <h2>Bord {order.tableNumber}</h2>

                        {order.items.map((item) => (
                            <div key={item.orderItemId}>
                                <p>
                                    {item.quantity}x {item.name}
                                </p>
                                {/* noten vises kun, hvis der er en */}
                                {item.note && <small>+ {item.note}</small>}
                            </div>
                        ))}

                        <button onClick={() => markDone.mutate(order.items.map((i) => i.orderItemId))} disabled={markDone.isPending}>DONE</button>
                    </div>
                ))}
            </div>
        </main>
    );
}