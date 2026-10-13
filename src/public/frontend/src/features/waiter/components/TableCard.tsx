import type { RestaurantTable } from "../types";

// "Props" er de oplysninger komponenten får udefra
type Props = {
  table: RestaurantTable;
  onClick: () => void;
};

export default function TableCard({ table, onClick }: Props) {
  return (
    <button className="card text-center w-100" onClick={onClick}>
      <div className="card-body">
        <div className="table-number">{table.tableNumber}</div>
        <p className="card-text text-secondary">{table.seats} pladser</p>
      </div>
    </button>
  );
}
