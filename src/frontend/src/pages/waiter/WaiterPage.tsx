import { useState } from "react";

import { useMenu } from "@/features/menu/hooks";
import { useTables } from "@/features/tables/useTables";
import { useOpenOrders, useTableOrder } from "@/features/orders/api";
import type { MenuItem } from "@/features/waiter/types";
import TableGrid from "@/features/waiter/components/TableGrid";
import OrderScreen from "@/features/waiter/components/OrderScreen";
import OrderPanel from "@/features/waiter/components/OrderPanel";

// iPad screen for the waiter: table overview -> tap a table -> build the order.
// Everything is saved in the database through OrderController, so orders survive a reload,
// show up on the kitchen board when sent, and end up in the order history.
export default function WaiterPage() {
  const menu = useMenu();
  const tables = useTables();
  const openOrders = useOpenOrders();

  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  // ---------- Loading / error ----------

  if (menu.isPending || tables.isPending || openOrders.isPending) {
    return <p className="p-8 text-muted-foreground">Indlæser...</p>;
  }
  if (menu.isError || tables.isError || openOrders.isError) {
    return <p className="p-8 text-destructive">Kunne ikke hente menu, borde eller ordrer fra serveren.</p>;
  }

  // ---------- Order screen (a table is selected) ----------

  if (selectedTable !== null) {
    return (
      <TableOrder
        // key: switching table = fresh component (search cleared, first category, new order state)
        key={selectedTable}
        tableNumber={selectedTable}
        menuItems={menu.data}
        onBack={() => setSelectedTable(null)}
      />
    );
  }

  // ---------- Table overview ----------

  return <TableGrid tables={tables.data} openOrders={openOrders.data} onSelect={setSelectedTable} />;
}

// One table's order screen. A separate component so useTableOrder gets the table number it belongs to.
function TableOrder({ tableNumber, menuItems, onBack }: { tableNumber: number; menuItems: MenuItem[]; onBack: () => void }) {
  const order = useTableOrder(tableNumber);

  return (
    <OrderScreen
      tableNumber={tableNumber}
      menuItems={menuItems}
      lines={order.lines}
      onBack={onBack}
      onAdd={(item) => order.add(item.itemId)}
      orderPanel={
        <OrderPanel
          lines={order.lines}
          isSaving={order.isSaving}
          error={order.error}
          onChangeQuantity={order.changeQuantity}
          onRemove={order.remove}
          onNote={order.setNote}
          onSend={order.send}
          onCancel={order.removeUnsent}
          onVoid={order.voidLine}
          onClose={() => {
            order.close();
            onBack(); // the table is done -> back to the overview
          }}
        />
      }
    />
  );
}