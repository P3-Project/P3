import type { MenuItem } from "./types"

function normalize(text: string){
    return text.toLowerCase().trim().replace(/\s+/g, " ");
}

// Gives a dish a score for the search text. Higher = better match. 0 = no match.
function score(item: MenuItem, query: string){
    const number = item.dishNumber?.toLowerCase() ?? "";
    const name = normalize(item.name);
    const startsWithDigit = /^\d/.test(query);

    // 1. Types a number => the dish number is what matters
    if(number && number === query) return 1000; // "24" => nr. 24
    if(startsWithDigit && number.startsWith(query)) return 500 - number.length; // "2" => 2, 2A, 20, 21, ... (shortest first)

    // 2. Typed letters => look at the name
    if(name.startsWith(query)) return 300; // "marg" => Margherita
    if(name.split(/[\s\-(/]+/).some((word) => word.startsWith(query))) return 200; // "bolo" => Pizza Bolognese
    if(name.includes(query)) return 100;

    // 3. Several words in any order, also checking ingredients: "kebab pizza" or "bacon burger"
    const words = query.split(" ");
    const haystack = `${name} ${normalize(item.dishDescription ?? "")} ${normalize(item.category)}`;
    if(words.length > 1 && words.every((word) => haystack.includes(word))) return 50;

    return 0;
}

// Return the best match, best first. Sold-out diesh are kept (so the waiter sees WHY
// it isn't there) but always sorted after the ones that can be ordered.

export function searchMenu(items: MenuItem[], rawQuery: string, limit = 12): MenuItem[] {
    const query = normalize(rawQuery);
    if(!query) return [];

    return items
        .map((item) => ({item, score: score(item, query) }))
        .filter((result) => result.score > 0)
        .sort((a, b) => Number(a.item.outOfStock) - Number(b.item.outOfStock) || b.score - a.score)
        .slice(0, limit)
        .map((result) => result.item);
}