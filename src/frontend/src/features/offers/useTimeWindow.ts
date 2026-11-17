import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

// Current time in Denmark as minutes since midnight, e.g. 11:30 -> 690.
// We ask for Europe/Copenhagen explicitly, so a visitor with a phone set to another
// time zone still sees the offer at the restaurant's 11–15, not their own.
function danishMinutesNow() {
  const parts = new Intl.DateTimeFormat("da-DK", {
    timeZone: "Europe/Copenhagen",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  const minute = Number(parts.find((p) => p.type === "minute")?.value);
  return hour * 60 + minute;
}

// "12:30" -> 750. Returns null if the text isn't a valid time.
function parseTime(text: string | null) {
  const match = text?.match(/^(\d{1,2}):(\d{2})$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

// Tells you if we're inside [startHour, endHour) right now, and how many minutes are left / until start.
// Re-checks every 30 seconds, so the banner switches on at 11:00 and off at 15:00 by itself,
// even if the page has been open all morning.
//
// Testing: add ?tid=12:30 (or ?tid=17:00) to the URL to pretend it's that time.
// Only works in development (npm run dev), so customers can't trigger it.
export function useTimeWindow(startHour: number, endHour: number) {
  const [searchParams] = useSearchParams();
  const fakeNow = import.meta.env.DEV ? parseTime(searchParams.get("tid")) : null;

  const [realNow, setRealNow] = useState(danishMinutesNow);
  useEffect(() => {
    const timer = setInterval(() => setRealNow(danishMinutesNow()), 30_000);
    return () => clearInterval(timer); // stop the timer when the page is left
  }, []);

  const now = fakeNow ?? realNow;
  const start = startHour * 60;
  const end = endHour * 60;

  return {
    isActive: now >= start && now < end,
    minutesLeft: end - now, // only meaningful while active
    hasStartedToday: now >= start, // false = before 11, true = after (used for "i dag" vs "i morgen")
  };
}

// 80 -> "1 t 20 min", 45 -> "45 min"
export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} t` : `${h} t ${m} min`;
}
