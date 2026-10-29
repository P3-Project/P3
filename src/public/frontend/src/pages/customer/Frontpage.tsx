import { Link } from "react-router";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { groupByCategory, useMenu } from "@/features/menu/hooks";
import type { MenuItem } from "@/features/menu/types";
import { LunchOfferBanner, LunchOfferCard } from "@/features/offers/components/LunchOffer";
import { lunchOffer } from "@/features/offers/lunchOffer";
import { useTimeWindow } from "@/features/offers/useTimeWindow";
import { formatPrice, toTitleCase } from "@/lib/format";

// ---------------------------------------------------------------------------
// Restaurant facts in ONE place.
// Anything left as null is not shown, so the page never shows made-up info.
// ---------------------------------------------------------------------------
const INFO = {
  phoneDisplay: "98 24 65 66",
  phoneHref: "tel:+4598246566",
  address: "Bredgade 6B, 9490 Pandrup" as string | null, // from PPSH's current website
  openingHours: null as { days: string; hours: string }[] | null, // TODO: e.g. [{ days: "Man–Fre", hours: "16–21" }]
};

// The three "doors" into the menu. Counts and lowest prices are calculated from the real menu.
const HIGHLIGHTS = [
  { category: "Pizza", title: "Pizza", text: "Klassikere fra ovnen, fra Margherita til husets egne." },
  { category: "Grill og steak specialiteter", title: "Grill & steak", text: "Bøf, kebab og kylling fra trækulsgrillen." },
  { category: "Burgere", title: "Burgere", text: "Fra cheeseburger til XL American." },
];

export default function Frontpage() {
  const menu = useMenu();
  const groups = menu.data ? groupByCategory(menu.data) : null;

  // Is it lunch-offer time (11–15 Danish time) right now? Updates by itself while the page is open.
  const lunch = useTimeWindow(lunchOffer.startHour, lunchOffer.endHour);

  return (
    <div className="space-y-20 md:space-y-28">
      {/* ================= Lunch offer, BIG (only 11–15) ================= */}
      {lunch.isActive && (
        <LunchOfferBanner window={lunch} phoneHref={INFO.phoneHref} phoneDisplay={INFO.phoneDisplay} />
      )}

      {/* ================= Hero ================= */}
      <section className="grid items-center gap-12 pt-4 md:grid-cols-[1.2fr_1fr] md:pt-10">
        <div>
          <p className="text-sm font-medium tracking-widest text-primary uppercase">Pizza · Grill · Burgere</p>

          {/* font-heading = Fraunces. text-balance spreads the words evenly over the lines */}
          <h1 className="mt-4 font-heading text-5xl leading-[1.05] font-medium tracking-tight text-balance md:text-6xl">
            Pizza fra ovnen. Bøf fra trækulsgrillen.
          </h1>

          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Pandrup Pizza &amp; Steak House. Spis hos os, eller ring og bestil bord.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {/* buttonVariants gives a Link the button look. Colour comes from --primary, no overrides needed */}
            <Link to="/menu" className={buttonVariants({ size: "lg", className: "h-12 px-6 text-base" })}>
              Se menukortet
              <ArrowRight />
            </Link>
            <a
              href={INFO.phoneHref}
              className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 border-foreground/20 px-6 text-base" })}
            >
              <Phone />
              Ring {INFO.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Right side: a small "menu card" with real dishes, so the page shows actual food, not stock photos */}
        <aside className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
          <p className="text-sm font-medium text-muted-foreground">Fra menukortet</p>
          <ul className="mt-4 space-y-4">
            {pickFeatured(groups).map((dish) => (
              <li key={dish.itemId} className="flex items-baseline gap-3">
                <span className="font-medium">{toTitleCase(dish.name)}</span>
                {/* dotted leader line, same style as the menu page */}
                <span aria-hidden="true" className="flex-1 translate-y-[-0.2em] border-b border-dotted border-foreground/25" />
                <span className="font-medium tabular-nums">{formatPrice(dish.price)}</span>
              </li>
            ))}
            {/* While loading: grey placeholder bars with the same height, so nothing jumps */}
            {!groups &&
              [0, 1, 2, 3].map((i) => <li key={i} className="h-6 animate-pulse rounded bg-muted" />)}
          </ul>
          <Link to="/menu" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Se alle retter <ArrowRight className="size-4" />
          </Link>
        </aside>
      </section>

      {/* ================= Three doors into the menu ================= */}
      <section>
        <h2 className="font-heading text-3xl font-medium tracking-tight">Hvad har du lyst til?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((h) => {
            const dishes = groups?.get(h.category) ?? [];
            const from = dishes.length ? Math.min(...dishes.map((d) => d.price)) : null;
            return (
              <Link
                key={h.category}
                to="/menu"
                className="group flex flex-col rounded-2xl border bg-card p-6 transition hover:border-primary/40 hover:shadow-sm"
              >
                <h3 className="font-heading text-2xl font-medium">{h.title}</h3>
                <p className="mt-2 text-muted-foreground">{h.text}</p>
                {/* mt-auto pushes this row to the bottom, so all three cards line up */}
                <div className="mt-auto flex items-center justify-between pt-6 text-sm">
                  <span className="text-muted-foreground">
                    {dishes.length > 0 && `${dishes.length} retter · fra ${formatPrice(from!)}`}
                  </span>
                  <ArrowRight className="size-5 text-primary transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= Lunch offer, small (the rest of the day) ================= */}
      {!lunch.isActive && <LunchOfferCard window={lunch} />}

      {/* ================= Visit / book ================= */}
      {/* Two columns only when there is address/opening-hours info to show on the right */}
      <section
        className={`grid gap-8 rounded-3xl bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14 ${
          INFO.address || INFO.openingHours ? "md:grid-cols-[1.4fr_1fr]" : ""
        }`}
      >
        <div>
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">Bestil bord</h2>
          <p className="mt-3 max-w-md opacity-85">
            Vi tager imod bordbestillinger på telefonen. Ring, så finder vi et bord til dig.
          </p>
          <a
            href={INFO.phoneHref}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-primary-foreground px-6 font-medium text-primary transition hover:opacity-90"
          >
            <Phone className="size-5" />
            {INFO.phoneDisplay}
          </a>
        </div>

        {/* Only shown when the real info has been filled in at the top of the file */}
        <dl className="space-y-5 self-center">
          {INFO.address && (
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 opacity-80" />
              <div>
                <dt className="text-sm opacity-75">Adresse</dt>
                <dd className="font-medium">{INFO.address}</dd>
              </div>
            </div>
          )}
          {INFO.openingHours && (
            <div className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 opacity-80" />
              <div>
                <dt className="text-sm opacity-75">Åbningstider</dt>
                {INFO.openingHours.map((row) => (
                  <dd key={row.days} className="flex justify-between gap-6 font-medium">
                    <span>{row.days}</span>
                    <span className="tabular-nums">{row.hours}</span>
                  </dd>
                ))}
              </div>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
}

// Picks a mix for the hero card: the first two pizzas + the first grill dish + the first burger.
// Uses whatever is in the database, so it changes automatically when the menu changes.
function pickFeatured(groups: Map<string, MenuItem[]> | null) {
  if (!groups) return [];
  const pick = (category: string, count: number) =>
    (groups.get(category) ?? []).filter((d) => !d.outOfStock).slice(0, count);
  return [...pick("Pizza", 2), ...pick("Grill og steak specialiteter", 1), ...pick("Burgere", 1)];
}
