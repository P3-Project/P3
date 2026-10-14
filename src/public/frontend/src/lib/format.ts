
// 79 -> "79 kr."
export function formatPrice(kroner: number){
    return `${kroner.toLocaleString("da-DK")} kr.`;
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