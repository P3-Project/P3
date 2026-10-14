import { formatPrice } from "@/lib/format";
import type { MenuItem } from "../types";

export function DishCard({ item}: { item: MenuItem }){
    return(
        <li className={`flex items-start justify-between gap-4 border-b py-3 last:border-b-0 ${item.outOfStock ? "opacity-50" : ""}`}>
            <div>
                <h3 className="font-medium">
                    {item.name}
                    {item.outOfStock && <span className="ml-2 text-sm text-destructive">Udsolgt</span>}
                </h3>
                {item.dishDescription && (
                    <p className="text-sm text-muted-foreground">{item.dishDescription}</p>
                )}
            </div>
            <span className="shrink-0 font-medium tabular-nums">{formatPrice(item.price)}</span>
        </li>
    );
}