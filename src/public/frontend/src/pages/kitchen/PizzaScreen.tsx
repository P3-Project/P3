import { usePizzaKitchen } from "../../features/pizza_kitchen/usePizzaKitchen";

export default function PizzaScreen() {
  // hent ordrer og DONE-funktionen
  const { orders, markDone } = usePizzaKitchen();

  return (
    <div>
      <h1>PIZZA KITCHEN</h1>
      <p>{orders.length} åbne ordrer</p>

      {/* et kort for hver ordre */}
      {orders.map((order) => (
        <div key={order.id}>
          <h2>Bord {order.tableNumber}</h2>

          {order.items.map((item) => (
            <div key={item.id}>
              <p>
                {item.quantity}x {item.name}
              </p>
              {/* noten vises kun, hvis der er en */}
              {item.note && <small>+ {item.note}</small>}
            </div>
          ))}

          <button onClick={() => markDone(order.id)}>DONE</button>
        </div>
      ))}
    </div>
  );
}
export default function PizzaScreen(){
    return(
        <main className="min-h-svh p-8">
            <h1 className="mb-6 text-3xl font-semibold">Køkken · Ordrer</h1>
            <p className="text-muted-foreground">Venter på ordre-endpoint i backenden.</p>
        </main>
    );
}