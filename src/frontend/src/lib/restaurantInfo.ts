import { useEffect, useState } from "react";

type Row = { label: string; days: number[]; open: number; close: number };
export type Season = { period: string; rows: Row[] };

const MON_SAT = [1, 2, 3, 4, 5, 6];
const SUN = [0];

export const NORMAL_SEASON: Season = {
  period: "16/8-30/6",
  rows: [
    { label: "Man-lør", days: MON_SAT, open: 11, close: 21 },
    { label: "Søn & helligdage", days: SUN, open: 12, close: 21 },
  ],
};

export const SUMMER_SEASON: Season = {
  period: "1/7-15/8",
  rows: [
    { label: "Man-lør", days: MON_SAT, open: 11, close: 22 },
    { label: "Søn & helligdage", days: SUN, open: 12, close: 22 },
  ],
};

// Time, weekday and date right now in denmark, so whatever timezone the customer uses will be shown in denmarks timezone. 
function danishNow() {

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Copenhagen",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

// Summer season is only from 1 July to 15 august, the rest of the year is normal season. 

export function currentSeason(now = danishNow()) {

  const summer = now.month === 7 || (now.month === 8 && now.day <= 15);
  return summer ? SUMMER_SEASON : NORMAL_SEASON;
}

// checks every 30 sec if the resturant is open. See the 30_000. 

export function useOpeningStatus() {

  const [now, setNow] = useState(danishNow);
  useEffect(() => {
    const timer = setInterval(() => setNow(danishNow()), 30_000);
    return () => clearInterval(timer);
  }, []);


  const season = currentSeason(now);
  const today = season.rows.find((r) => r.days.includes(now.weekday));
  if (!today) return { isOpen: false, text: "Lukket i dag" };

  if (now.minutes >= today.open * 60 && now.minutes < today.close * 60) {
    return { isOpen: true, text: `Åbent nu · til kl. ${today.close}` };
  }

  if (now.minutes < today.open * 60) {
    return { isOpen: false, text: `Lukket · åbner kl. ${today.open}` };

  }

  const tomorrow = season.rows.find((r) => r.days.includes((now.weekday + 1) % 7));
  return { isOpen: false, text: tomorrow ? `Lukket · åbner i morgen kl. ${tomorrow.open}` : "Lukket" };
}

// Restaurant facts in ONE place, used by the front page and the footer.
// Anything left as null is not shown, so the site never shows made-up info.
export const RESTAURANT = {
  name: "Pandrup Pizza & Steak House",
  phoneDisplay: "98 24 65 66",
  phoneHref: "tel:+4598246566",
  address: "Bredgade 6B, 9490 Pandrup" as string | null, // from PPSH's current website

  // Rows for the season we are in now, so it switches between normal or summer periods. 
  // The footer use this aswell. 
  openingHours: currentSeason().rows.map((r) => ({ days: r.label, hours: `${r.open}-${r.close}` })) as | { days: string; hours: string }[] | null,
  // Payment only at resturant so the waiter keeps the contact point with the customer
  payment: "kontant, Dankort, Visa eller Mastercard",
};