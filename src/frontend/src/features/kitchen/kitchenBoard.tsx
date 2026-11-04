import { Ban, Check, CheckCheck, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toTitleCase } from "@/lib/format";
import {
    groupIntoTickets,
    useAcknowledgeVoid,
    useCompleteItems,
    useKitchenQueue,
    useVoidNotices,
    type Station,
    type Ticket,
    type VoidNotice,
} from "./kitchen";

const stationLabel: Record<Station, string> = { PIZZA: "Pizza", GRILL: "Grill" };

// The kitchen screen. No station = "Oversigt" (everything), otherwise only that station's dishes.
// Used by OverviewScreen, PizzaScreen and GrillScreen.
export function KitchenBoard({ station }: { station?: Station }) {
    const queue = useKitchenQueue(station);
    const complete = useCompleteItems();
    const voidNotices = useVoidNotices(station);
    const acknowledge = useAcknowledgeVoid();

    const items = queue.data ?? [];
    const tickets = groupIntoTickets(items);
    const dishCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="space-y-5">
            {/* ---------- Header row ---------- */}
            <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="font-heading text-3xl font-medium">{station ? stationLabel[station] : "Alle stationer"}</h1>
                    <p className="mt-1 text-muted-foreground">
                        {tickets.length} {tickets.length === 1 ? "bestilling" : "bestillinger"} · {dishCount}{" "}
                        {dishCount === 1 ? "ret" : "retter"}
                    </p>
                </div>

                {/* Small "live" indicator so the kitchen trusts the screen is up to date */}
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className={`size-2 rounded-full ${queue.isError ? "bg-destructive" : "bg-green-600"}`} />
                    {queue.isError ? "Ingen forbindelse" : "Opdateres automatisk"}
                </p>
            </header>

            {/* If the server drops out, keep showing the last known orders and warn, instead of emptying the screen */}
            {queue.isError && (
                <p role="alert" className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive">
                    <WifiOff className="size-5" />
                    Mistet forbindelsen til serveren. Prøver igen...
                </p>
            )}

            {/* Cancellations come first: the kitchen may be making that dish right now */}
            {(voidNotices.data ?? []).map((notice) => (
                <VoidNoticeCard key={notice.orderItemId} notice={notice} onAcknowledge={() => acknowledge.mutate(notice.orderItemId)} />
            ))}

            {complete.isError && (
                <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-destructive">
                    Kunne ikke gemme. Retten er sat tilbage på skærmen.
                </p>
            )}

            {/* ---------- The tickets ---------- */}
            {queue.isPending ? (
                <p className="py-20 text-center text-muted-foreground">Henter ordrer...</p>
            ) : tickets.length === 0 ? (
                <div className="grid place-items-center rounded-3xl border border-dashed py-24 text-center">
                    <CheckCheck className="size-10 text-muted-foreground" />
                    <p className="mt-3 font-heading text-2xl">Alt er lavet</p>
                    <p className="mt-1 text-muted-foreground">Nye ordrer dukker op her af sig selv.</p>
                </div>
            ) : (
                // Left to right, oldest first. auto-fill: as many 19rem columns as fit (3 on an iPad in landscape).
                // items-start: a short ticket doesn't stretch to match a tall one next to it.
                <div className="grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] items-start gap-4">
                    {tickets.map((ticket, index) => (
                        <TicketCard
                            key={ticket.orderId}
                            ticket={ticket}
                            isOldest={index === 0}
                            showStation={!station} // only useful on the overview
                            onComplete={(ids) => complete.mutate(ids)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// One table's pending dishes
function TicketCard({
    ticket,
    isOldest,
    showStation,
    onComplete,
}: {
    ticket: Ticket;
    isOldest: boolean;
    showStation: boolean;
    onComplete: (orderItemIds: number[]) => void;
}) {
    return (
        <article
            aria-label={`Bord ${ticket.tableNumber}`}
            // The oldest ticket gets a stronger border: "make this one first"
            className={`overflow-hidden rounded-2xl border-2 bg-card shadow-sm ${isOldest ? "border-primary" : "border-border"}`}
        >
            <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div>
                    <h2 className="font-heading text-2xl leading-none font-medium">Bord {ticket.tableNumber}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Ordre #{ticket.orderId}
                        {isOldest && " · næste i køen"}
                    </p>
                </div>
                {/* Finish the whole ticket in one tap */}
                <Button variant="outline" className="h-11 gap-1.5 px-3" onClick={() => onComplete(ticket.items.map((i) => i.orderItemId))}>
                    <CheckCheck />
                    Alt færdig
                </Button>
            </header>

            <ul className="divide-y">
                {ticket.items.map((item) => (
                    <li key={item.orderItemId} className="flex items-start gap-3 px-4 py-3">
                        {/* Quantity first and big: the most important number for the cook */}
                        <span className="w-9 shrink-0 font-heading text-2xl leading-tight font-medium tabular-nums">{item.quantity}×</span>

                        <div className="min-w-0 flex-1">
                            <p className="text-lg leading-tight font-medium">{toTitleCase(item.name)}</p>
                            {showStation && (
                                <p className="mt-0.5 text-xs tracking-wide text-muted-foreground uppercase">{stationLabel[item.station]}</p>
                            )}
                            {/* Notes (allergies, "medium rare") must be impossible to miss -> yellow highlight */}
                            {item.note && (
                                <p className="mt-2 rounded-lg bg-amber-100 px-2.5 py-1.5 text-sm font-medium text-amber-950">{item.note}</p>
                            )}
                        </div>

                        {/* size-12 = 48px: easy to hit with a quick tap, even with busy hands */}
                        <Button size="icon" className="size-12 shrink-0" aria-label={`${item.name} færdig`} onClick={() => onComplete([item.orderItemId])}>
                            <Check className="size-6" />
                        </Button>
                    </li>
                ))}
            </ul>
        </article>
    );
}

// A dish the waiter removed after it had been in the kitchen a while. Stays until someone taps "OK, set".
function VoidNoticeCard({ notice, onAcknowledge }: { notice: VoidNotice; onAcknowledge: () => void }) {
    const minutesInKitchen = Math.round((Date.parse(notice.voidedAt) - Date.parse(notice.sentAt)) / 60_000);

    return (
    <div role="alert" className="flex items-center gap-4 rounded-2xl border-2 border-destructive bg-destructive/10 px-4 py-3">
        <Ban className="size-7 shrink-0 text-destructive" />
        <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold tracking-wide text-destructive uppercase">Annulleret · stop med at lave</p>
        <p className="text-lg font-medium">
            Bord {notice.tableNumber} · {notice.quantity}× {toTitleCase(notice.name)}
            {notice.note && <span className="text-muted-foreground"> ({notice.note})</span>}
        </p>
        <p className="text-sm text-muted-foreground">Var i køkkenet i {minutesInKitchen} min.</p>
        </div>
        <Button variant="outline" className="h-12 shrink-0 px-5" onClick={onAcknowledge}>
        OK, set
        </Button>
    </div>
    );
}