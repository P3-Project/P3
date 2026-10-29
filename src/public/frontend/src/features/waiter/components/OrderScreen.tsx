import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Check, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { groupByCategory } from "@/features/menu/hooks";
import { toTitleCase } from "@/lib/format";
import { searchMenu } from "../searchMenu";
import type { MenuItem, OrderLine } from "../types";
import MenuItemCard from "./MenuItemCard";

type Props = {
  tableNumber: number;
  menuItems: MenuItem[];
  lines: OrderLine[]; // this table's order, to show counters on the dish cards
  onBack: () => void;
  onAdd: (item: MenuItem) => void;
  orderPanel: ReactNode; // the <OrderPanel> for the right-hand column, passed in from WaiterPage
};

// The screen where the waiter builds an order for one table. Layout on an iPad in landscape:
//
//   ┌ ← Bord 2 ────┬ [ Søg nr. eller navn ] ─────────┬ Ordre ─────────┐
//   │ Pizza        │ ┌──────┐ ┌──────┐              │ Moro   [−]4[+] │
//   │ Pizza deluxe │ │ dish │ │ dish │              │                │
//   │ ...          │ └──────┘ └──────┘              │ Total  340 kr. │
//   │              │                                │ [Send (1)]     │
//   └──────────────┴────────────────────────────────┴────────────────┘
//
// Everything fits on one screen. Only the lists inside each column scroll.
export default function OrderScreen({ tableNumber, menuItems, lines, onBack, onAdd, orderPanel }: Props) {
  const groups = groupByCategory(menuItems);
  const categories = [...groups.keys()];

  // null = nothing tapped yet -> first category (the menu isn't loaded when useState first runs)
  const [category, setCategory] = useState<string | null>(null);
  const activeCategory = category ?? categories[0];

  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const results = searchMenu(menuItems, query);
  const isSearching = query.trim() !== "";

  // Short "✓ Margherita tilføjet" confirmation, so the waiter knows the tap/Enter worked
  const [lastAdded, setLastAdded] = useState<{ name: string; at: number } | null>(null);
  useEffect(() => {
    if (!lastAdded) return;
    const timer = setTimeout(() => setLastAdded(null), 2500);
    return () => clearTimeout(timer); // a new add restarts the timer
  }, [lastAdded]);

  function add(item: MenuItem) {
    onAdd(item);
    setLastAdded({ name: toTitleCase(item.name), at: Date.now() });
  }

  // Enter in the search field: add the best match that can be ordered, then clear for the next dish.
  // So "24 ⏎ 7 ⏎ marg ⏎" adds three dishes without touching the screen.
  function addTopResult() {
    const best = results.find((item) => !item.outOfStock);
    if (!best) return;
    add(best);
    setQuery("");
    searchRef.current?.focus(); // keep the keyboard open for the next number
  }

  // How many of a dish are on the unsent part of the order -> counter on the card
  const countInOrder = (itemId: number) =>
    lines.filter((l) => l.itemId === itemId && l.sentAt === null).reduce((sum, l) => sum + l.quantity, 0);

  const visibleItems = isSearching ? results : (groups.get(activeCategory) ?? []);

  const backButton = (
    <Button variant="outline" size="icon" className="size-11 shrink-0" aria-label="Tilbage til borde" onClick={onBack}>
      <ArrowLeft />
    </Button>
  );

  return (
    // Two columns on iPad portrait (md), three on landscape (lg). minmax(0,1fr) stops wide content
    // (like the category row) from pushing the middle column under the order panel.
    <div className="grid h-full md:grid-cols-[minmax(0,1fr)_21rem] lg:grid-cols-[13rem_minmax(0,1fr)_22rem]">
      {/* ===== Column 1 (landscape only): table + categories ===== */}
      <aside className="hidden min-h-0 flex-col border-r lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b px-3">
          {backButton}
          <h1 className="font-heading text-2xl font-medium">Bord {tableNumber}</h1>
        </div>

        <nav aria-label="Kategorier" className="min-h-0 flex-1 overflow-y-auto p-2">
          {categories.map((c) => {
            const isActive = !isSearching && c === activeCategory;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setCategory(c);
                  setQuery(""); // picking a category leaves search mode
                }}
                // Every row the same height (h-12) -> evenly spaced list
                className={`flex h-12 w-full items-center rounded-lg px-3 text-left text-sm transition ${
                  isActive ? "bg-primary font-medium text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ===== Column 2: search + dishes ===== */}
      <section className="flex min-h-0 min-w-0 flex-col">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b px-4">
          {/* On portrait there's no category column, so the back button + table live here */}
          <div className="flex items-center gap-3 lg:hidden">
            {backButton}
            <h1 className="font-heading text-xl font-medium whitespace-nowrap">Bord {tableNumber}</h1>
          </div>

          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTopResult();
                if (e.key === "Escape") setQuery("");
              }}
              placeholder="Søg nr. eller navn, fx 2 eller marg"
              aria-label="Søg i menuen"
              // iPad: no autocorrect/capitals messing with "marg" or "2a", and the keyboard's
              // return key says "Go"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
              className="h-11 w-full rounded-xl border bg-card pr-12 pl-10 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
            />
            {isSearching && (
              <button
                type="button"
                aria-label="Ryd søgning"
                onClick={() => {
                  setQuery("");
                  searchRef.current?.focus();
                }}
                className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Portrait only: categories as one evenly spaced, swipeable row */}
        <nav
          aria-label="Kategorier"
          className="flex shrink-0 gap-2 overflow-x-auto border-b px-4 py-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            const isActive = !isSearching && c === activeCategory;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setCategory(c);
                  setQuery("");
                }}
                className={`h-11 shrink-0 rounded-full px-4 text-sm whitespace-nowrap ${
                  isActive ? "bg-primary font-medium text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {c}
              </button>
            );
          })}
        </nav>

        {/* Title row: which list we're looking at + the "added" confirmation.
            aria-live: screen readers announce the confirmation too. */}
        <div className="flex h-12 shrink-0 items-center justify-between px-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            {isSearching ? `Resultater for "${query.trim()}"` : activeCategory}
          </h2>
          <p aria-live="polite" className="text-sm">
            {lastAdded && (
              <span key={lastAdded.at} className="inline-flex animate-in items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary fade-in">
                <Check className="size-4" />
                {lastAdded.name} tilføjet
              </span>
            )}
          </p>
        </div>

        {/* The dishes. key: a new category/search = fresh list, scrolled to the top.
            auto-fill: as many 14rem-wide columns as fit (2 on an iPad, more on a big screen).
            auto-rows-max: each row is as tall as its tallest card, so text is never cut off. */}
        <div
          key={isSearching ? "search" : activeCategory}
          className="grid min-h-0 flex-1 auto-rows-max grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] content-start gap-3 overflow-y-auto px-4 pb-4"
        >
          {visibleItems.map((item) => (
            <MenuItemCard
              key={item.itemId}
              item={item}
              inOrder={countInOrder(item.itemId)}
              onClick={() => {
                add(item);
                if (isSearching) setQuery(""); // after tapping a result, go back to the normal list
              }}
            />
          ))}

          {isSearching && visibleItems.length === 0 && (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              Ingen retter matcher "{query.trim()}".
            </p>
          )}
        </div>
      </section>

      {/* ===== Column 3: the order ===== */}
      <aside className="hidden min-h-0 border-l bg-card md:block">{orderPanel}</aside>
    </div>
  );
}
