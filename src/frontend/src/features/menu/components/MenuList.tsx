import { useState } from "react";

import { QueryState } from "@/components/QueryState";
import { groupByCategory, useMenu } from "../hooks";
import { DishCard } from "./DishCard";

// The menu, one category at a time.
// Desktop: category list on the left (like a table of contents), dishes on the right.
// Phone:   one row of category names you swipe sideways, dishes below.
export function MenuList() {
  const menu = useMenu();

  // Which category the customer picked. null = nothing picked yet (hooks must stay up here, at the top).
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <QueryState query={menu} loadingText="Indlæser menukort...">
      {(items) => {
        const groups = groupByCategory(items); // Map: "Pizza" -> [dishes], ...
        const categories = [...groups.keys()]; // in menu.json order
        const active = selected ?? categories[0]; // default to the first category
        const dishes = groups.get(active) ?? [];

        // Shared click handler for both the sidebar and the phone tabs
        function choose(category: string) {
          setSelected(category);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        return (
          // Two columns from md and up: 14rem sidebar + the rest. One column on phones.
          <div className="md:grid md:grid-cols-[14rem_1fr] md:gap-12">
            
            {/* ---------- Desktop: sidebar ---------- */}
            <nav aria-label="Kategorier" className="hidden md:block">
              {/* sticky: the list stays in view while scrolling long categories like Pizza.
                  top-24 = below the sticky site header (h-16) plus some air */}
              <div className="sticky top-24">
                <p className="mb-3 px-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Kategorier
                </p>
                <ul className="space-y-1">
                  {categories.map((category) => {
                    const isActive = category === active;
                    const count = groups.get(category)?.length ?? 0;
                    return (
                      <li key={category}>
                        <button
                          type="button"
                          onClick={() => choose(category)}
                          aria-pressed={isActive}
                          // Active: a small white "card" (same border + shadow as the dish card),
                          // so it looks connected to the card on the right. Others: quiet, with a hover tint.
                          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-[0.95rem] transition-colors ${
                            isActive
                              ? "border-border bg-card font-medium text-primary shadow-sm"
                              : "border-transparent text-muted-foreground hover:bg-card/60 hover:text-foreground"
                          }`}
                        >
                          <span className="truncate">{category}</span>
                          {/* how many dishes are in the category, e.g. 59 */}
                          <span
                            className={`text-xs tabular-nums ${isActive ? "text-primary/70" : "text-muted-foreground/70"}`}
                          >
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            {/* ---------- Phone: swipeable tabs ---------- */}
            {/* -mx-4 px-4: lets the row run edge to edge on the phone screen.
                The two [..] classes hide the scrollbar (Firefox / Chrome+Safari) but keep swiping. */}
            <nav
              aria-label="Kategorier"
              className="sticky top-16 z-10 -mx-4 mb-8 flex gap-6 overflow-x-auto border-b bg-background px-4 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category) => {
                const isActive = category === active;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => choose(category)}
                    aria-pressed={isActive}
                    // Underline the active tab; -mb-px makes it sit on top of the nav's border line
                    className={`-mb-px shrink-0 border-b-2 py-3 text-sm whitespace-nowrap ${
                      isActive
                        ? "border-primary font-medium text-primary"
                        : "border-transparent text-muted-foreground"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </nav>

            {/* ---------- The dishes ---------- */}
            <section aria-labelledby="category-heading"
              className="min-w-0 rounded-3xl border bg-card p-5 shadow-sm md:p-10">
              <header className="mb-8">
                <h2 id="category-heading" className="font-heading text-3xl font-medium tracking-tight">
                  {active}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dishes.length} {dishes.length === 1 ? "ret" : "retter"}
                </p>
              </header>

              {/* space-y-6: whitespace instead of divider lines between dishes */}
              <ul className="space-y-6">
                {dishes.map((dish) => (
                  <DishCard key={dish.itemId} item={dish} />
                ))}
              </ul>
            </section>
          </div>
        );
      }}
    </QueryState>
  );
}
