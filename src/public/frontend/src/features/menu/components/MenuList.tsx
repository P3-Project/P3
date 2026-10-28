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
              {/* sticky: the list stays in view while scrolling long categories like Pizza */}
              <ul className="sticky top-8 space-y-0.5">
                {categories.map((category) => {
                  const isActive = category === active;
                  return (
                    <li key={category}>
                      <button
                        type="button"
                        onClick={() => choose(category)}
                        aria-pressed={isActive}
                        // Active: tomato text with a small bar on the left. Others: quiet grey.
                        className={`w-full border-l-2 py-1.5 pl-4 text-left text-sm transition-colors ${
                          isActive
                            ? "border-primary font-medium text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ---------- Phone: swipeable tabs ---------- */}
            {/* -mx-4 px-4: lets the row run edge to edge on the phone screen.
                The two [..] classes hide the scrollbar (Firefox / Chrome+Safari) but keep swiping. */}
            <nav
              aria-label="Kategorier"
              className="sticky top-0 z-10 -mx-4 mb-8 flex gap-6 overflow-x-auto border-b bg-background px-4 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
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
            <section aria-labelledby="category-heading">
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
