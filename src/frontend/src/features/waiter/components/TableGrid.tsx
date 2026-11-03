import { useFitGrid } from "../hooks/useFitGrid";
import type { OrderLine, RestaurantTable } from "../types";
import TableCard from "./TableCard";

type Props = {
  tables: RestaurantTable[];
  orders: Record<number, OrderLine[]>;
  onSelect: (tableNumber: number) => void;
};

const GAP = 16; // px between tiles; must match the gap in the style below

// The table overview. Fills the whole area under the nav bar; tiles scale with the number of tables.
export default function TableGrid({ tables, orders, onSelect }: Props) {
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
            openLines={(orders[table.tableNumber] ?? []).reduce((sum, l) => sum + l.quantity, 0)}
            onClick={() => onSelect(table.tableNumber)}
          />
        ))}
      </div>
    </div>
  );
}
