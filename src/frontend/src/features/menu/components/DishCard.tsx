import { formatPrice, toTitleCase } from "@/lib/format";
import type { MenuItem } from "../types";

// One dish, laid out like a printed menu:
//   Pizza Bolognese ··················· 89 kr.
//   med tomatsauce, ost, kødsauce, løg og oregano
// No borders or boxes: whitespace separates the dishes, which keeps the page calm.
export function DishCard({ item }: { item: MenuItem }) {
  return (
    <li className={item.outOfStock ? "opacity-45" : undefined}>
      {/* items-baseline: name and price sit on the same text line even if sizes differ */}
      <div className="flex items-baseline gap-3">
        <h3 className="font-medium text-foreground">{toTitleCase(item.name)}</h3>

        {/* Dotted "leader" line that fills the space between name and price, like on paper menus.
            flex-1 makes it take all leftover width, translate nudges it down to the text baseline. */}
        <span aria-hidden="true" className="flex-1 translate-y-[-0.2em] border-b border-dotted border-foreground/25" />

        <span className="shrink-0 font-medium tabular-nums">
          {item.outOfStock ? "Udsolgt" : formatPrice(item.price)}
        </span>
      </div>

      {item.dishDescription && (
        // max-w-prose: long ingredient lists wrap at a comfortable reading width
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {item.dishDescription}
        </p>
      )}
    </li>
  );
}
