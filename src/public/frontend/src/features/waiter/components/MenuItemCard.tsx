import type { MenuItem } from "../types";

type Props = {
  item: MenuItem;
  onClick: () => void;
};

export default function MenuItemCard({ item, onClick }: Props) {
  return (
    <button
      className="card w-100 h-100 text-start"
      onClick={onClick}
      disabled={item.outOfStock}
    >
      <div className="card-body">
        <h5 className="card-title">{item.name}</h5>
        <p className="card-text small text-secondary">{item.dishDescription}</p>
        <strong>{item.price} kr</strong>
        {item.outOfStock && (
          <span className="badge bg-secondary ms-2">Udsolgt</span>
        )}
      </div>
    </button>
  );
}
