import "bootstrap/dist/css/bootstrap.min.css";
import "@/features/waiter/waiter.css";
import { useState } from "react";
import { mockTables, mockMenu } from "@/features/waiter/mockData";
import type { MenuItem, OrderLine } from "@/features/waiter/types";
import TableCard from "@/features/waiter/components/TableCard";
import MenuItemCard from "@/features/waiter/components/MenuItemCard";
import OrderPanel from "@/features/waiter/components/OrderPanel";

// henter kategorierne fra menuen uden dubletter
const categories = [...new Set(mockMenu.map((item) => item.category))];

export default function WaiterPage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [category, setCategory] = useState(categories[0]);
  // ordrer per bord, bordnummer er key
  const [orders, setOrders] = useState<Record<number, OrderLine[]>>({});

  function addItem(item: MenuItem) {
    if (selectedTable === null) return;

    const lines = orders[selectedTable] ?? [];
    // tæl kun op hvis linjen ikke er sendt og ikke har en note
    const existing = lines.find(
      (l) =>
        l.item.itemId === item.itemId && l.sentAt === null && l.note === "",
    );

    let newLines: OrderLine[];
    if (existing) {
      // findes allerede, så +1 på antal
      newLines = lines.map((l) =>
        l === existing ? { ...l, quantity: l.quantity + 1 } : l,
      );
    } else {
      // ny linje
      newLines = [
        ...lines,
        { lineId: Date.now(), item, quantity: 1, note: "", sentAt: null },
      ];
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
    updateLines(
      (lines) =>
        lines
          .map((l) =>
            l.lineId === lineId ? { ...l, quantity: l.quantity + delta } : l,
          )
          .filter((l) => l.quantity > 0), // fjernes hvis antal bliver 0
    );
  }

  function removeLine(lineId: number) {
    updateLines((lines) => lines.filter((l) => l.lineId !== lineId));
  }

  function setNote(lineId: number, note: string) {
    updateLines((lines) =>
      lines.map((l) => (l.lineId === lineId ? { ...l, note } : l)),
    );
  }

  function sendToKitchen() {
    const now = new Date().toISOString();
    // TODO: POST til backend når endpoint er klar
    updateLines((lines) =>
      lines.map((l) => (l.sentAt === null ? { ...l, sentAt: now } : l)),
    );
  }

  function cancelOrder() {
    // fjerner kun det der ikke er sendt
    updateLines((lines) => lines.filter((l) => l.sentAt !== null));
  }

  // ordresiden når et bord er valgt
  if (selectedTable !== null) {
    const visibleItems = mockMenu.filter((item) => item.category === category);
    const lines = orders[selectedTable] ?? [];

    return (
      <div className="waiter-app">
        <div className="waiter-header">
          <button
            className="btn btn-navy-outline"
            onClick={() => setSelectedTable(null)}
          >
            ←
          </button>
          <h1>Bord {selectedTable}</h1>
        </div>

        <div className="row g-0">
          {/* menu */}
          <div className="col-md-8 p-3">
            <div className="category-tabs">
              {categories.map((c) => (
                <button
                  key={c}
                  className={
                    c === category ? "btn btn-navy" : "btn btn-navy-outline"
                  }
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="row g-2">
              {visibleItems.map((item) => (
                <div className="col-6 col-lg-4" key={item.itemId}>
                  <MenuItemCard item={item} onClick={() => addItem(item)} />
                </div>
              ))}
            </div>
          </div>

          {/* ordre */}
          <div className="col-md-4 p-3">
            <OrderPanel
              lines={lines}
              onChangeQuantity={changeQuantity}
              onRemove={removeLine}
              onNote={setNote}
              onSend={sendToKitchen}
              onCancel={cancelOrder}
            />
          </div>
        </div>
      </div>
    );
  }

  // bordoversigt
  return (
    <div className="waiter-app">
      <div className="waiter-header">
        <h1>Borde</h1>
      </div>
      <div className="p-3">
        <div className="row g-3">
          {mockTables.map((table) => (
            <div className="col-6 col-md-3" key={table.tableNumber}>
              <TableCard
                table={table}
                onClick={() => setSelectedTable(table.tableNumber)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
