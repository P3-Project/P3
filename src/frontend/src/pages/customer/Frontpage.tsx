import { Link } from "react-router";
import { ArrowRight, Clock, CreditCard, MapPin, Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { groupByCategory, useMenu } from "@/features/menu/hooks";
import type { MenuItem } from "@/features/menu/types";
import { LunchOfferBanner, LunchOfferCard } from "@/features/offers/components/LunchOffer";
import { lunchOffer } from "@/features/offers/lunchOffer";
import { useTimeWindow } from "@/features/offers/useTimeWindow";
import { formatPrice, toTitleCase } from "@/lib/format";
// Same name as before (INFO), so nothing else in the file has to change
import { RESTAURANT as INFO, NORMAL_SEASON, SUMMER_SEASON, currentSeason, useOpeningStatus } from "@/lib/restaurantInfo";
// Imported JPG photos into the frontpage whenever loaded in

import heroImg from "@/assets/img/hero.jpg";
import pizzaImg from "@/assets/img/pizza.jpg";
import grillImg from "@/assets/img/grill.jpg";
import burgerImg from "@/assets/img/burger.jpg";
// TODO: import another photo that suits for the restaurant.
import aboutImg from "@/assets/img/hero.jpg";

// The three "doors" into the menu. Counts and lowest prices are calculated from the real menu.
const HIGHLIGHTS = [
  { category: "Pizza", title: "Pizza", image: pizzaImg, text: "Klassikere fra ovnen, fra Margherita til husets egne." },
  { category: "Grill og steak specialiteter", title: "Grill & steak", image: grillImg, text: "Bøf, kebab og kylling fra trækulsgrillen." },
  { category: "Burgere", title: "Burgere", image: burgerImg, text: "Fra cheeseburger til XL American." },
];

// "Om os" section is used for facts directly from pandruppizza.dk

const FACTS = [

  { value: "1994", label: "Åbnet" },
  { value: "110", label: "Pladser inde" },
  { value: "30", label: "På terrassen" },
];

export default function Frontpage() {
  // Opens Google Maps (app on phones) with the address searched
  const mapsHref = INFO.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(INFO.address)}` : null;
  const menu = useMenu();
  const groups = menu.data ? groupByCategory(menu.data) : null;

  // Is it lunch-offer time (11–15 Danish time) right now? Updates by itself while the page is open.
  const lunch = useTimeWindow(lunchOffer.startHour, lunchOffer.endHour);


  // Updates itself between "Åbnet nu til kl 21" or "Lukket åbner kl 11".

  const open = useOpeningStatus();

  // Shows only as small note under opening hours the season we are not in, so the customer only notices the big notes. 

  const season = currentSeason();
  const other = season === SUMMER_SEASON ? NORMAL_SEASON : SUMMER_SEASON;
  const otherName = other === SUMMER_SEASON ? "Sommer" : "Resten af året";

  return (
    <div className="space-y-20 md:space-y-28">
      {/* ================= Lunch offer, BIG (only 11–15) ================= */}
      {lunch.isActive && (
        <LunchOfferBanner window={lunch} phoneHref={INFO.phoneHref} phoneDisplay={INFO.phoneDisplay} />
      )}

      {/* ================= Hero ================= */}

      <section className="relative overflow-hidden rounded-3xl">
        <img src={heroImg} alt="Pizza og et glas rødvin på et træbord" className="absolute inset-0 size-full object-cover" />
        {/* Dark on the left side. Lighter on the right side, where the food is shown */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />


        <div className="relative grid items-center gap-12 px-6 py-14 md:grid-cols-[1.2fr_1fr] md:px-12 md:py-20">
          <div className="text-white">
            <p className="text-sm font-medium tracking-widest text-white/75 uppercase">Pizza · Grill · Burgere</p>
            {/* font-heading = Fraunces. text-balance spreads the words evenly over the lines */}
            <h1 className="mt-4 font-heading text-5xl leading-[1.05] font-medium tracking-tight text-balance md:text-6xl">
              Pizza fra ovnen. Bøf fra trækulsgrillen.
            </h1>


            {/* open / closed badge. green dot when open, red dot when closed */}
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-sm font-medium backdrop-blur">
              <span className={`size-2 rounded-full ${open.isOpen ? "bg-lime-400" : "bg-red-400"}`} />
              {open.text}
            </p>

            <p className="mt-5 max-w-md text-lg text-white/80">
              Pandrup Pizza &amp; Steak House. Spis hos os, eller ring og bestil bord.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {/* buttonVariants gives a Link the button look. Colour comes from --primary, no overrides needed */}
              <Link to="/menu" className={buttonVariants({ size: "lg", className: "h-12 px-6 text-base" })}>
                Se menukortet
                <ArrowRight />
              </Link>

              {/* see through window with a white border, so it can be shown on the dark photo */}

              <a
                href={INFO.phoneHref}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 text-base font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                <Phone className="size-4" />
                Ring {INFO.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Right side: a small "menu card" with real dishes, so the page shows actual food, not stock photos */}
          <aside className="rounded-3xl border bg-card p-6 shadow-lg md:p-8">
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
        </div>
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

                // Photo insert here cut by the card's round corners
                className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition hover:border-primary/40 hover:shadow-sm"
              >
                {/* object cover and aspect: all three photos have same size */}

                <img
                  src={h.image}
                  alt={h.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-2xl font-medium">{h.title}</h3>
                  <p className="mt-2 text-muted-foreground">{h.text}</p>
                  {/* mt-auto pushes this row to the bottom, so all three cards line up */}
                  <div className="mt-auto flex items-center justify-between pt-6 text-sm">
                    <span className="text-muted-foreground">
                      {dishes.length > 0 && `${dishes.length} retter · fra ${formatPrice(from!)}`}
                    </span>
                    <ArrowRight className="size-5 text-primary transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>


      {/* ================= About us ================= */}
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-14">

        <img src={aboutImg} alt="En ret fra Pandrup Pizza & Steak House" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover" />
        <div>
          <p className="text-sm font-medium tracking-widest text-primary uppercase">Om os</p>
          <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight">Tyrkiske rødder, siden 1994</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Hos Pandrup Pizza er vi stolte af vores mad, som bærer præg af vores tyrkiske aner. Vi har udvidet restauranten mange gange, så vi kan byde flere og flere gæster indenfor, tæt på Fårup Sommerland.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-3">
            {FACTS.map((f) => (

              // flex-col and order-first: shows the number above its label, but read after it by screen readers
              <div key={f.label} className="flex flex-col rounded-2xl border bg-card p-4">
                <dt className="text-sm text-muted-foreground">{f.label}</dt>
                <dd className="order-first font-heading text-3xl font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      {/* ================= Lunch offer, full price list (the rest of the day) ================= */}
      {!lunch.isActive && <LunchOfferCard window={lunch}/>}

      {/* ================= Visit / book ================= */}
      {/* overflow-hidden: the map is cut by the card's round corners, so it looks built in.
          No padding on the section itself. the left column has its own. */}
      <section className="grid overflow-hidden rounded-3xl bg-primary text-primary-foreground md:grid-cols-2">
        {/* ---- Left: book a table, address, opening hours ---- */}
        <div className="self-center px-6 py-10 md:px-12 md:py-16">
          <h2 className="font-heading text-3xl font-medium tracking-tight md:text-4xl">Bestil bord eller take-away</h2>
          <p className="mt-3 max-w-md opacity-85">
            Al bestilling foregår på telefonen. Ring, så finder vi et bord til dig eller har maden klar til afhentning.
          </p>
          <a
            href={INFO.phoneHref}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-lg bg-primary-foreground px-6 font-medium text-primary transition hover:opacity-90"
          >
            <Phone className="size-5" />
            {INFO.phoneDisplay}
          </a>


          {/* Payment only at restaurant, so the waiter keeps the contact with the customer.   */}

          <p className="mt-6 flex max-w-md gap-3">
            <CreditCard className="mt-0.5 size-5 shrink-0 opacity-80" />
            <span>

              <span className="font-medium">Betaling:</span> Du betaler i restauranten, {INFO.payment}.
            </span>
          </p>

          {/* Address + opening hours, under a thin line */}
          <dl className="mt-10 space-y-5 border-t border-primary-foreground/20 pt-8">
            {INFO.address && mapsHref && (
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 opacity-80" />
                <div>
                  <dt className="text-sm opacity-75">Adresse</dt>
                  <dd>
                    <a href={mapsHref} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                      {INFO.address}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            {INFO.openingHours && (
              <div className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 opacity-80" />
                <div>
                  <dt className="text-sm opacity-75">Åbningstider ({season.period})</dt>
                  {INFO.openingHours.map((row) => (
                    <dd key={row.days} className="flex justify-between gap-6 font-medium">
                      <span>{row.days}</span>
                      <span className="tabular-nums">{row.hours}</span>
                    </dd>
                  ))}

                  {/* Other seasons is made smaller, so customer knows the hours change*/}
                  <dd className="mt-1 text-sm opacity-75">
                    {otherName} ({other.period}): til kl. {other.rows[0].close}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        {/* ---- Right: the map, edge to edge ---- */}
        {INFO.address && (
          // relative + min-h: on phones the map gets its own height under the text
          // on desktop it stretches to the full height of the card
          <div className="relative min-h-72 md:min-h-full">
            <iframe
              title={`Kort over ${INFO.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(INFO.address)}&z=15&output=embed`}
              // absolute inset-0: fill the right half completely.
              // The filter tones Google's bright colours down so they sit better next to the olive green.
              className="absolute inset-0 size-full border-0 [filter:grayscale(0.6)_sepia(0.15)_contrast(1.05)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}
      </section>

      {/* phones only section, call button stay at buttom. */}
      <a
        href={INFO.phoneHref}
        className="fixed inset-x-4 bottom-4 z-30 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary font-medium text-primary-foreground shadow-lg md:hidden"
      >
        <Phone className="size-5" />
        Ring og bestil · {INFO.phoneDisplay}
      </a>
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
