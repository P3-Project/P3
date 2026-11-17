import { Link, Navigate, useNavigate, useParams } from "react-router";

import { useMenu } from "@/features/menu/hooks";
import { useTables } from "@/features/tables/useTables";
import { useTableOrder } from "@/features/orders/api";
import type { MenuItem } from "@/features/waiter/types";
import OrderScreen from "@/features/waiter/components/OrderScreen";
import OrderPanel from "@/features/waiter/components/OrderPanel";

// "/waiter/:tableNumber": the order screen for one table, e.g. /waiter/5
export default function TableOrderPage() {
  const { tableNumber } = useParams(); // always a string from the URL, e.g. "5"
  const navigate = useNavigate();
  const menu = useMenu();
  const tables = useTables();

  const table = Number(tableNumber);
  const backToTables = () => navigate("/waiter");

  // /waiter/abc or /waiter/0 -> not a table number, go back to the overview
  if (!Number.isInteger(table) || table <= 0) {
    return <Navigate to="/waiter" replace />;
  }

  if (menu.isPending || tables.isPending) {
    return <p className="p-8 text-muted-foreground">Indlæser...</p>;
  }
  if (menu.isError || tables.isError) {
    return <p className="p-8 text-destructive">Kunne ikke hente menu eller borde fra serveren.</p>;
  }

  // A number that looks fine but isn't a real table, e.g. /waiter/99
  if (!tables.data.some((t) => t.tableNumber === table)) {
    return (
      <div className="space-y-4 p-8">
        <p>Bord {table} findes ikke.</p>
        <Link to="/waiter" className="text-primary underline">Tilbage til bordene</Link>
      </div>
    );
  }

  return (
    <TableOrder
      // key: going straight from /waiter/3 to /waiter/4 gives a fresh screen
      // (search cleared, first category) instead of reusing table 3's state
      key={table}
      tableNumber={table}
      menuItems={menu.data}
      onBack={backToTables}
    />
  );
}

// One table's order screen. Moved here unchanged from WaiterPage.tsx.
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
          onVoid={order.voidLine}
          onNote={order.setNote}
          onSend={order.send}
          onCancel={order.removeUnsent}
          onClose={() => {
            order.close();
            onBack(); // the table has paid -> back to the overview
          }}
        />
      }
    />
  );
}