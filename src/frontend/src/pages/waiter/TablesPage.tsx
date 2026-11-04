import { useNavigate } from "react-router";

import { useTables } from "@/features/tables/useTables";
import { useOpenOrders } from "@/features/orders/api";
import TableGrid from "@/features/waiter/components/TableGrid";

// "/waiter": the table overview. Tapping a table opens "/waiter/<number>".
export default function TablesPage() {
  const navigate = useNavigate();
  const tables = useTables();
  const openOrders = useOpenOrders();

  if (tables.isPending || openOrders.isPending) {
    return <p className="p-8 text-muted-foreground">Indlæser...</p>;
  }
  if (tables.isError || openOrders.isError) {
    return <p className="p-8 text-destructive">Kunne ikke hente borde eller ordrer fra serveren.</p>;
  }

  return (
    <TableGrid
      tables={tables.data}
      openOrders={openOrders.data}
      // Before: setSelectedTable(n). Now the table goes into the URL instead,
      // so back button, reload and bookmarks all work.
      onSelect={(tableNumber) => navigate(`/waiter/${tableNumber}`)}
    />
  );
}