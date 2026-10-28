import { formatPrice, toTitleCase } from "@/lib/format";
import type { MenuItem } from "../types";

type Props = {
  item: MenuItem;
  inOrder: number; // how many of this dish are already on the unsent order
  onClick: () => void;
};

// One tappable dish. The whole card is the button, so it's easy to hit on an iPad.
export default function MenuItemCard({ item, inOrder, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={item.outOfStock}
      className={`relative flex min-h-28 flex-col rounded-xl border-2 bg-card p-4 text-left transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 ${
        inOrder > 0 ? "border-primary" : "border-transparent shadow-sm hover:border-foreground/20"
      }`}
    >
      {/* Counter in the corner: "2" = already added twice */}
      {inOrder > 0 && (
        <span className="absolute top-3 right-3 grid size-7 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {inOrder}
        </span>
      )}

      {/* Dish number first: it's what waiters and customers say ("en nr. 24") */}
      <span className="pr-9">
        {item.dishNumber && (
          <span className="mr-2 font-semibold text-primary tabular-nums">{item.dishNumber}</span>
        )}
        <span className="font-medium">{toTitleCase(item.name)}</span>
      </span>

      {item.dishDescription && (
        // line-clamp-2: long ingredient lists stop after two lines, so cards stay similar in height
        <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.dishDescription}</span>
      )}

      {/* mt-auto pushes the price to the bottom of the card */}
      <span className="mt-auto pt-3 font-semibold tabular-nums">
        {item.outOfStock ? "Udsolgt" : formatPrice(item.price)}
      </span>
    </button>
  );
}
