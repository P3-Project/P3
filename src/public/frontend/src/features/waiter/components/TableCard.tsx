import type { RestaurantTable } from "../types";

// "Props" er de oplysninger komponenten får udefra
type Props = {
  table: RestaurantTable;
  openLines: number; // how many dishes are on this table's order (0 = free table)
  onClick: () => void;
};

// One table. It fills whatever grid cell it gets (see useFitGrid), so with few tables
// the tiles are big, with many tables they shrink.
export default function TableCard({ table, openLines, onClick }: Props) {
  const isOpen = openLines > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      // @container: the text sizes below are measured against THIS tile's size,
      // not the screen, so the number grows and shrinks together with the tile.
      className={`@container flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 p-3 transition active:scale-[0.98] ${
        isOpen ? "border-primary bg-primary/5" : "border-border bg-card hover:border-foreground/30"
      }`}
    >
      <span className="text-[clamp(0.7rem,6cqmin,1rem)] tracking-widest text-muted-foreground uppercase">Bord</span>

      {/* cqmin = % of the tile's shorter side. clamp() keeps it between 2.5rem and 8rem. */}
      <span className="font-heading text-[clamp(2.5rem,32cqmin,8rem)] leading-none font-medium">{table.tableNumber}</span>

      <span className="mt-2 text-[clamp(0.8rem,6cqmin,1.1rem)] text-muted-foreground">{table.seats} pladser</span>

      {/* Fixed height whether or not there's a badge, so all numbers line up across tiles */}
      <span className="mt-3 flex h-7 items-center">
        {isOpen && (
          <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            {openLines} {openLines === 1 ? "ret" : "retter"}
          </span>
        )}
      </span>
    </button>
  );
}
