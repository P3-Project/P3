// Restaurant facts in ONE place, used by the front page and the footer.
// Anything left as null is not shown, so the site never shows made-up info.
export const RESTAURANT = {
  name: "Pandrup Pizza & Steak House",
  phoneDisplay: "98 24 65 66",
  phoneHref: "tel:+4598246566",
  address: "Bredgade 6B, 9490 Pandrup" as string | null, // from PPSH's current website
  openingHours: null as { days: string; hours: string }[] | null, // TODO: e.g. [{ days: "Man–Fre", hours: "16–21" }]
};