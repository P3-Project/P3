import { Clock, Phone, Sandwich } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { lunchOffer as offer } from "../lunchOffer";
import { formatDuration } from "../useTimeWindow";

type Window = { isActive: boolean; minutesLeft: number; hasStartedToday: boolean };

// "11–15"
const hours = `${offer.startHour}–${offer.endHour}`;

// ---------------------------------------------------------------------------
// BIG version: shown at the top of the front page while the offer is running (11–15)
// ---------------------------------------------------------------------------
export function LunchOfferBanner({ window, phoneHref, phoneDisplay }: { window: Window; phoneHref: string; phoneDisplay: string }) {
  return (
    <section
      aria-labelledby="lunch-title"
      // relative + overflow-hidden: the big decorative icon can sit half outside the box without spilling
      className="relative overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14"
    >
      {/* Decorative sandwich icon in the corner. aria-hidden: screen readers skip it */}
      <Sandwich aria-hidden="true" strokeWidth={1} className="pointer-events-none absolute -right-10 -bottom-10 size-72 opacity-10 md:size-96" />

      <div className="relative max-w-2xl">
        {/* Live status pill with a pulsing dot: makes it obvious this is happening NOW */}
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary-foreground" />
          </span>
          Serveres nu · til kl. {offer.endHour} ({formatDuration(window.minutesLeft)} tilbage)
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-2">
          <h2 id="lunch-title" className="font-heading text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl">
            {offer.title}
          </h2>
          <p className="font-heading text-3xl md:text-4xl">
            {formatPrice(offer.price)}
          </p>
        </div>

        <p className="mt-4 text-lg opacity-90">{offer.included}</p>

        {/* The three choices as "chips" */}
        <p className="mt-6 text-sm font-medium tracking-wide uppercase opacity-75">Frit valg mellem</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {offer.choices.map((choice) => (
            <li key={choice} className="rounded-full border border-primary-foreground/30 px-4 py-1.5">
              {choice}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm opacity-75">{offer.dressing}</p>

        <a
          href={phoneHref}
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary-foreground px-6 font-medium text-primary transition hover:opacity-90"
        >
          <Phone className="size-5" />
          Bestil på {phoneDisplay}
        </a>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SMALL version: shown further down the rest of the day, so customers still know it exists
// ---------------------------------------------------------------------------
export function LunchOfferCard({ window }: { window: Window }) {
  // Before 11 -> "i dag kl. 11", after 15 -> "i morgen kl. 11"
  const next = window.hasStartedToday ? "i morgen" : "i dag";

  return (
    <section aria-labelledby="lunch-card-title" className="flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:flex-row sm:items-center">
      <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Sandwich className="size-7" />
      </div>

      <div className="flex-1">
        <h2 id="lunch-card-title" className="font-heading text-2xl font-medium">
          {offer.title} · {formatPrice(offer.price)}
        </h2>
        <p className="mt-1 text-muted-foreground">
          Frit valg: {offer.choices.join(", ")}. {offer.dressing}.
        </p>
      </div>

      <p className="flex shrink-0 items-center gap-2 text-sm font-medium">
        <Clock className="size-4 text-primary" />
        Alle dage kl. {hours} · næste gang {next}
      </p>
    </section>
  );
}
