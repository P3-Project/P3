import { Link } from "react-router";
import { Clock, MapPin, Phone } from "lucide-react";

import { RESTAURANT } from "@/lib/restaurantInfo";

// The links in the footer. "Login" is for staff, so it's labelled that way.
const PAGES = [
  { to: "/", label: "Forside" },
  { to: "/menu", label: "Menukort" },
  { to: "/login", label: "Login for personale" },
];

// Footer for the customer site. Dark (bg-foreground = the charcoal text colour),
// so it clearly closes the page. Full width; the content inside lines up in a max-w-7xl column.
export function SiteFooter() {
  const { name, phoneDisplay, phoneHref, address, openingHours } = RESTAURANT;
  const year = new Date().getFullYear(); // updates by itself every new year

  // Opens Google Maps (app on phones) with the address searched
  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : null;

  return (
    <footer className="mt-24 bg-foreground text-background">
      {/* Three columns on desktop, stacked on phones */}
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:px-10">
        {/* ---- Column 1: name, one line about the place, call button ---- */}
        <div>
          <p className="font-heading text-2xl font-medium">{name}</p>
          <p className="mt-3 max-w-xs text-sm opacity-70">
            Pizza fra ovnen og bøf fra trækulsgrillen. Spis hos os, eller ring og bestil bord.
          </p>
          <a
            href={phoneHref}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-background px-5 text-sm font-medium text-foreground transition hover:opacity-90"
          >
            <Phone className="size-4" />
            Ring {phoneDisplay}
          </a>
        </div>

        {/* ---- Column 2: where and when ---- */}
        <div>
          <h2 className="text-xs font-medium tracking-widest uppercase opacity-60">Find os</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {address && mapsHref && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 opacity-70" />
                {/* target=_blank: open the map in a new tab, so the menu stays open */}
                <a href={mapsHref} target="_blank" rel="noreferrer" className="hover:underline">
                  {address}
                </a>
              </li>
            )}
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 opacity-70" />
              <a href={phoneHref} className="tabular-nums hover:underline">
                {phoneDisplay}
              </a>
            </li>
            {/* Only shown once the real opening hours are filled in */}
            {openingHours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 opacity-70" />
                <dl className="space-y-1">
                  {openingHours.map((row) => (
                    <div key={row.days} className="flex gap-4">
                      <dt className="w-20 opacity-70">{row.days}</dt>
                      <dd className="tabular-nums">{row.hours}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            )}
          </ul>
        </div>

        {/* ---- Column 3: the pages ---- */}
        <nav aria-label="Sidefod">
          <h2 className="text-xs font-medium tracking-widest uppercase opacity-60">Sider</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {PAGES.map((page) => (
              <li key={page.to}>
                <Link to={page.to} className="opacity-85 transition hover:underline hover:opacity-100">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ---- Bottom strip: copyright ---- */}
      <div className="border-t border-background/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs opacity-60 md:flex-row md:justify-between md:px-10">
          <p>
            © {year} {name}
          </p>
          <p>Bordbestilling foregår telefonisk</p>
        </div>
      </div>
    </footer>
  );
}