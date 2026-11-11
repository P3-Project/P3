import { useEffect, useState } from "react";

import { Link } from "react-router";

import { CreditCard, LogIn } from "lucide-react";

import { useMenu } from "@/features/menu/hooks";

import { LunchOfferCard } from "@/features/offers/components/LunchOffer";

import { lunchOffer } from "@/features/offers/lunchOffer";

import { useTimeWindow } from "@/features/offers/useTimeWindow";

import { toTitleCase } from "@/lib/format";

// Same name as before (INFO), so nothing else in the file has to change

import { RESTAURANT as INFO, NORMAL_SEASON, SUMMER_SEASON, currentSeason, useOpeningStatus } from "@/lib/restaurantInfo";

// Imported JPG photos into the frontpage whenever loaded in

// TODO: import another photo that suits for the restaurant.

import heroImg from "@/assets/img/hero.jpg";


// A small box on the right side, that marks items not in stock. 

const EYEBROW = "text-xs font-medium tracking-widest text-primary uppercase";

export default function Frontpage() {

  const menu = useMenu();

  // Checks if it is lunch offer. (11-15) This updates itself
  const lunch = useTimeWindow(lunchOffer.startHour, lunchOffer.endHour);

  const open = useOpeningStatus();


  // This tells clock, date and greets in danish.
  const clock = useClock();

  // Shows only as small note under opening hours the season we are not in, so the customer only notices the big notes. 
  const season = currentSeason();
  const other = season === SUMMER_SEASON ? NORMAL_SEASON : SUMMER_SEASON;
  const otherName = other === SUMMER_SEASON ? "Sommer" : "Resten af året";

  // This lets the waiter know , what is sold out before taking orders from customers. 
  const soldOut = menu.data?.filter((dish) => dish.outOfStock) ?? [];

  return (


    <div className="space-y-10 md:space-y-14">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden rounded-3xl">
        <img src={heroImg} alt="" className="absolute inset-0 size-full object-cover" />
        {/* Dark on the left side. Lighter on the right side, where the food is shown */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/45" />

        <div className="relative flex flex-wrap items-end justify-between gap-8 px-6 py-10 text-white md:px-10 md:py-12">
          <div>
            <p className="text-sm text-white/75">{clock.date}</p>
            <h1 className="mt-2 font-heading text-4xl font-medium tracking-tight md:text-5xl ">{clock.greeting}</h1>
            <p className="mt-4 max-w-md text-white/85">
              Log ind med dit medarbejdernummer for at komme til dine borde, køkkenskærmen eller reservationerne.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">

              {/* open / closed badge. green dot when open, red dot when closed */}
              <Statusbadge dot={open.isOpen ? "bg-lime-400" : "bg-red-400"}>{open.text}</Statusbadge>
              {/* Only active between 11-15, so it reminds the waiter about the offer. */}
              {lunch.isActive && (
                <Statusbadge dot="bg-amber-300">Frokosttilbud kører nu · til kl. {lunchOffer.endHour}</Statusbadge>
              )}

            </div>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <p className="text-5xl font-semibold tabular-nums md:text-6xl">{clock.time}</p>

            {/* Main action on the page, which can be used easily on iPad */}

            <Link
              to="/login"

              className="inline-flex h-14 items-center gap-2 rounded-xl bg-white px-8 text-lg font-medium text-primary transition hover:opacity-90"
            >
              <LogIn className="size-5" />
              Log ind
            </Link>
          </div>
        </div>
      </section>

      {/* Info about the day */}

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">

        {/* left side: price list of the lunch offer */}

        <LunchOfferCard window={lunch} />

        <div className="grid content-start gap-4">

          {/* Sold out from the menus stock */}

          <div className="rounded-3xl border bg-card p-6">

            <p className={EYEBROW}>Udsolgt lige nu</p>
            {!menu.data ? (
              <p className="mt-3 text-muted-foreground">Henter menukortet ...</p>
            ) : soldOut.length === 0 ? (
              <p className="mt-3 text-muted-foreground">Alt er på lager.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {soldOut.map((dish) => (

                  <li key={dish.itemId} className="flex items-center justify-between gap-3">
                    <span className="font-medium">{toTitleCase(dish.name)}</span>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Udsolgt</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Opening hours for the current season, small season as small note and payment */}

          <div className="rounded-3xl border bg-card p-6">
            <p className={EYEBROW}>Åbningstider ({season.period})</p>

            <dl className="mt-3 space-y-1">
              {INFO.openingHours?.map((row) => (
                <div key={row.days} className="flex justify-between gap-6">
                  <dt>{row.days}</dt>
                  <dd className="font-medium tabular-nums">{row.hours}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-sm text-muted-foreground">
              {otherName} ({other.period}): til kl. {other.rows[0].close}
            </p>

            {/* Payment only at restaurant, so the waiter keeps the contact with the customer.   */}

            <p className="mt-5 flex gap-2 border-t pt-4 text-sm">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Betaling i restauranten: {INFO.payment} </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Small dot which is seen above on the top banner

function Statusbadge({ dot, children }: { dot: string; children: React.ReactNode }) {

  return (

    <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-sm font-medium backdrop-blur">
      <span className={`size-2 rounded-full ${dot}`} />
      {children}

    </p>
  );
}


// 


function useClock() {

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {

    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer); // This will stop the timer of 30_000, when the user is leaving the site.
  }, []);

  const format = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("da-DK", { timeZone: "Europe/Copenhagen", ...options }).format(now);


  const time = format({ hour: "2-digit", minute: "2-digit" });

  const date = format({ weekday: "long", day: "numeric", month: "long" });

  const hour = Number(format({ hour: "numeric", hourCycle: "h23" }))

  const greeting = hour < 10 ? "God morgen" : hour < 18 ? "God dag" : "God aften";

  return { time, date: date.charAt(0).toUpperCase() + date.slice(1), greeting };

}