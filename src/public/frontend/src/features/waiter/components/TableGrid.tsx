import { useFitGrid } from "../hooks/useFitGrid";
import type { OrderDto, RestaurantTable } from "../types";
import TableCard from "./TableCard";

type Props = {
  tables: RestaurantTable[];
  openOrders: OrderDto[];
  onSelect: (tableNumber: number) => void;
};

const GAP = 16; // px between tiles; must match the gap in the style below

// The table overview. Fills the whole area under the nav bar; tiles scale with the number of tables.
export default function TableGrid({ tables, openOrders, onSelect }: Props) {
  const { ref, cols, rows } = useFitGrid(tables.length, GAP);

  return (
    // h-full: take all the height StaffLayout gives us. p-4 is the outer margin.
    <div className="h-full p-4">
      <div
        ref={ref}
        className="grid h-full"
        // Column/row counts are computed at runtime, so they go in `style`, not in a Tailwind class
        style={{
          gap: GAP,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {tables.map((table) => (
          <TableCard
            key={table.tableNumber}
            table={table}
            openLines={(openOrders.find((o) => o.tableNumber === table.tableNumber)?.items ?? [])
              .filter((l) => !l.voidedAt) // cancelled dishes don't count
              .reduce((sum, l) => sum + l.quantity, 0)}
            onClick={() => onSelect(table.tableNumber)}
          />
        ))}
      </div>
    </div>
  );
}
