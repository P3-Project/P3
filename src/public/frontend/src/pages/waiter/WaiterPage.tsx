import { useState } from "react";

import { useMenu } from "@/features/menu/hooks";
import { useTables } from "@/features/tables/useTables";
import type { MenuItem, OrderLine } from "@/features/waiter/types";
import TableGrid from "@/features/waiter/components/TableGrid";
import OrderScreen from "@/features/waiter/components/OrderScreen";
import OrderPanel from "@/features/waiter/components/OrderPanel";

// iPad screen for the waiter: table overview -> tap a table -> build the order.
// Menu and tables come from the backend (GET /api/menu, GET /api/tables).
// The order itself still only lives here in React state until the backend has an order endpoint.
export default function WaiterPage() {
  const menu = useMenu();
  const tables = useTables();

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  // ordrer per bord, bordnummer er key
  const [orders, setOrders] = useState<Record<number, OrderLine[]>>({});

  function addItem(item: MenuItem) {
    if (selectedTable === null) return;

    const lines = orders[selectedTable] ?? [];
    // tæl kun op hvis linjen ikke er sendt og ikke har en note
    const existing = lines.find((l) => l.item.itemId === item.itemId && l.sentAt === null && l.note === "");

    let newLines: OrderLine[];
    if (existing) {
      // findes allerede, så +1 på antal
      newLines = lines.map((l) => (l === existing ? { ...l, quantity: l.quantity + 1 } : l));
    } else {
      // ny linje
      newLines = [...lines, { lineId: Date.now(), item, quantity: 1, note: "", sentAt: null }];
    }

    setOrders({ ...orders, [selectedTable]: newLines });
  }

  // hjælper så jeg ikke skal skrive det samme i hver funktion
  function updateLines(update: (lines: OrderLine[]) => OrderLine[]) {
    if (selectedTable === null) return;
    const lines = orders[selectedTable] ?? [];
    setOrders({ ...orders, [selectedTable]: update(lines) });
  }

  function changeQuantity(lineId: number, delta: number) {
    updateLines((lines) =>
      lines
        .map((l) => (l.lineId === lineId ? { ...l, quantity: l.quantity + delta } : l))
        .filter((l) => l.quantity > 0), // fjernes hvis antal bliver 0
    );
  }

  function removeLine(lineId: number) {
    updateLines((lines) => lines.filter((l) => l.lineId !== lineId));
  }

  function setNote(lineId: number, note: string) {
    updateLines((lines) => lines.map((l) => (l.lineId === lineId ? { ...l, note } : l)));
  }

  function sendToKitchen() {
    const now = new Date().toISOString();
    // TODO: POST til backend når endpoint er klar
    updateLines((lines) => lines.map((l) => (l.sentAt === null ? { ...l, sentAt: now } : l)));
  }

  function cancelOrder() {
    // fjerner kun det der ikke er sendt
    updateLines((lines) => lines.filter((l) => l.sentAt !== null));
  }

  // ---------- Loading / error ----------

  if (menu.isPending || tables.isPending) {
    return <p className="p-8 text-muted-foreground">Indlæser...</p>;
  }
  if (menu.isError || tables.isError) {
    return <p className="p-8 text-destructive">Kunne ikke hente menu eller borde fra serveren.</p>;
  }

  // ---------- Order screen (a table is selected) ----------

  if (selectedTable !== null) {
    const lines = orders[selectedTable] ?? [];

    return (
      <OrderScreen
        // key: switching table = fresh screen (search cleared, back on the first category)
        key={selectedTable}
        tableNumber={selectedTable}
        menuItems={menu.data}
        lines={lines}
        onBack={() => setSelectedTable(null)}
        onAdd={addItem}
        orderPanel={
          <OrderPanel
            lines={lines}
            onChangeQuantity={changeQuantity}
            onRemove={removeLine}
            onNote={setNote}
            onSend={sendToKitchen}
            onCancel={cancelOrder}
          />
        }
      />
    );
  }

  // ---------- Table overview ----------

  return <TableGrid tables={tables.data} orders={orders} onSelect={setSelectedTable} />;
}
