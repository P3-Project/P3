
// 79 -> "79 kr."
export function formatPrice(kroner: number){
    return `${kroner.toLocaleString("da-DK")} kr.`;
}

// Abbreviations that should stay in capitals
const KEEP_UPPERCASE = new Set(["XL", "BBQ"]);

// "PIZZA BOLOGNESE" -> "Pizza Bolognese", "T-BONE STEAK" -> "T-Bone Steak",
// "CALZONE (INDBAGT)" -> "Calzone (Indbagt)". The menu data is ALL CAPS, which reads as shouting.
export function toTitleCase(text: string) {
  return text
    .toLowerCase()
    // \p{L} = any letter, incl. æ/ø/å. Capitalise a letter at the start, or after a space, -, ( or /
    .replace(/(^|[\s\-(/])(\p{L})/gu, (_, before: string, letter: string) => before + letter.toUpperCase())
    // Put abbreviations back: "Xl" -> "XL"
    .replace(/\p{L}+/gu, (word) => (KEEP_UPPERCASE.has(word.toUpperCase()) ? word.toUpperCase() : word));
}

// 18:00:00 (Java LocalTime) -> "18:00"
export function formatTime(time: string){
    return time.slice(0, 5);
}

// Date -> "2026-10-13" (the format Spring's LocalDate and <input type="data"> both use) Built from Local parts on purpose: toISOString() uses UTC and can give yesterday's date.
export function toIsoDate(date: Date){
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}