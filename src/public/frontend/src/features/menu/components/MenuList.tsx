import { QueryState } from "@/components/QueryState";
import { groupByCategory, useMenu } from "../hooks";
import { DishCard } from "./DishCard";

export function MenuList(){
    const menu = useMenu();

    return(
        <QueryState query={menu} loadingText="Indlæser menukort...">
            {(items) => (
                <div className="space-y-8">
                    {[...groupByCategory(items)].map(([category, dishes]) => (
                        <section key={category}>
                            <h2 className="mb-2 text-xl font-semibold">{category}</h2>
                            <ul className="m-0 list-none p-0">
                                {dishes.map((dish) => (
                                    <DishCard key={dish.itemId} item={dish}/>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </QueryState>
    );
}