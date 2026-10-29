import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { formatPrice, toTitleCase } from "@/lib/format";
import { dayLabel, formatClock, groupByDay, useOrderHistory, type OrderDto, type OrderStatus } from "@/features/orders/history";

// How far back the staff can look
const RANGES = [
  { days: 1, label: "I dag" },
  { days: 7, label: "7 dage" },
  { days: 30, label: "30 dage" },
];

const statusStyle: Record<OrderStatus, { label: string; className: string }> = {
  OPEN: { label: "Åben", className: "bg-amber-100 text-amber-950" },
  CLOSED: { label: "Betalt", className: "bg-primary/10 text-primary" },
  CANCELLED: { label: "Annulleret", className: "bg-muted text-muted-foreground line-through" },
};

// Every order from the last X days, grouped per day. Tap an order to see what was on it.
export default function OrderHistory() {
  const [days, setDays] = useState(30);
  const [table, setTable] = useState(""); // optional filter: only this table
  const history = useOrderHistory(days);

  const orders = (history.data ?? [])
    .filter((o) => o.items.length > 0) // skip orders that were opened and emptied again (auto-cancelled)
    .filter((o) => !table || String(o.tableNumber) === table.trim());
  const groups = groupByDay(orders);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-medium">Ordrehistorik</h1>
          <p className="mt-1 text-muted-foreground">Alle ordrer fra de seneste {days === 1 ? "24 timer" : `${days} dage`}.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Range picker: one segmented control, big enough to tap on an iPad */}
          <div role="group" aria-label="Periode" className="flex rounded-xl bg-muted p-1">
            {RANGES.map((range) => (
              <button
                key={range.days}
                type="button"
                aria-pressed={days === range.days}
                onClick={() => setDays(range.days)}
                className={`h-10 rounded-lg px-4 text-sm transition ${
                  days === range.days ? "bg-background font-medium shadow-sm" : "text-muted-foreground"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Table filter. inputMode numeric: the iPad shows the number keyboard */}
          <label className="relative">
            <span className="sr-only">Bordnummer</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={table}
              onChange={(e) => setTable(e.target.value)}
              inputMode="numeric"
              placeholder="Bord nr."
              className="h-12 w-32 rounded-xl border bg-card pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </label>
        </div>
      </header>

      {history.isPending && <p className="py-16 text-center text-muted-foreground">Henter ordrer...</p>}
      {history.isError && (
        <p role="alert" className="rounded-xl border border-destructive/40 p-4 text-destructive">
          {history.error.message}
        </p>
      )}
      {history.isSuccess && groups.length === 0 && (
        <p className="rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
          Ingen ordrer{table && ` for bord ${table}`} i perioden.
        </p>
      )}

      {/* One section per day, newest day first */}
      {groups.map(({ dayKey, orders: dayOrders }) => {
        // Cancelled orders don't count towards the day's revenue
        const dayTotal = dayOrders.filter((o) => o.status !== "CANCELLED").reduce((sum, o) => sum + o.total, 0);
        return (
          <section key={dayKey} aria-label={dayLabel(dayKey)}>
            <div className="mb-2 flex items-baseline justify-between px-1">
              <h2 className="font-heading text-xl font-medium">{dayLabel(dayKey)}</h2>
              <p className="text-sm text-muted-foreground tabular-nums">
                {dayOrders.length} {dayOrders.length === 1 ? "ordre" : "ordrer"} · {formatPrice(dayTotal)}
              </p>
            </div>
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {dayOrders.map((order) => (
                <OrderRow key={order.orderId} order={order} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// One order. <details> = a built-in open/close box: no state needed, and it works with keyboard and screen readers.
function OrderRow({ order }: { order: OrderDto }) {
  const status = statusStyle[order.status];
    const dishCount = order.items.filter((i) => !i.voidedAt).reduce((sum, i) => sum + i.quantity, 0);

  return (
    <li>
      <details className="group">
        {/* The always-visible row. list-none hides the default triangle; we draw our own chevron. */}
        <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-4 py-3 hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
          <span className="w-12 shrink-0 font-medium tabular-nums">{formatClock(order.createdAt)}</span>
          <span className="w-20 shrink-0 font-heading text-lg">Bord {order.tableNumber}</span>
          <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
            {order.waiterName} · {dishCount} {dishCount === 1 ? "ret" : "retter"}
          </span>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>{status.label}</span>
          <span className="w-20 shrink-0 text-right font-medium tabular-nums">{formatPrice(order.total)}</span>
          {/* group-open: rotates when the <details> is open */}
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
        </summary>

        {/* The dishes on the order */}
        <ul className="space-y-2 border-t bg-muted/30 px-4 py-3 sm:pl-20">
          {order.items.map((item) => (
              // Cancelled dishes stay visible, crossed out, so the history shows what really happened
              <li key={item.orderItemId} className={`flex items-baseline gap-3 text-sm ${item.voidedAt ? "text-muted-foreground line-through" : ""}`}>
              <span className="w-8 shrink-0 tabular-nums">{item.quantity}×</span>
              <span className="flex-1">
                {toTitleCase(item.name)}
                {item.note && <span className="ml-2 text-muted-foreground italic">({item.note})</span>}
                {item.voidedAt && <span className="ml-2 no-underline">· annulleret</span>}
              </span>
              <span className="tabular-nums">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
          <li className="pt-1 text-xs text-muted-foreground">
            Ordre #{order.orderId}
            {order.closedAt && ` · betalt kl. ${formatClock(order.closedAt)}`}
            {order.cancelledAt && ` · annulleret kl. ${formatClock(order.cancelledAt)}`}
          </li>
        </ul>
      </details>
    </li>
  );
}