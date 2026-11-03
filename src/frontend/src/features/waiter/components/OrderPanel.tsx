import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, toTitleCase } from "@/lib/format";
import type { OrderLine } from "../types";

type Props = {
  lines: OrderLine[];
  onChangeQuantity: (lineId: number, delta: number) => void;
  onRemove: (lineId: number) => void;
  onNote: (lineId: number, note: string) => void;
  onSend: () => void;
  onCancel: () => void;
};

// The order for the selected table, in the right-hand column.
// Header and footer are fixed; only the list in the middle scrolls,
// so "Send til køkken" is ALWAYS visible without scrolling.
export default function OrderPanel({ lines, onChangeQuantity, onRemove, onNote, onSend, onCancel }: Props) {
  // samlet pris for hele ordren
  const total = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  // knapperne skal kun virke hvis der er noget der ikke er sendt
  const unsentCount = lines.filter((l) => l.sentAt === null).length;

  return (
    <div className="flex h-full flex-col">
      {/* h-16: same height as the header rows in the other two columns, so they line up */}
      <h2 className="flex h-16 shrink-0 items-center border-b px-5 font-heading text-xl font-medium">Ordre</h2>

      {/* flex-1 + min-h-0 + overflow-y-auto: this part takes the leftover height and scrolls */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        {lines.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Tryk på en ret, eller søg efter nummer eller navn.
          </p>
        ) : (
          <ul className="divide-y">
            {lines.map((line) => {
              const isSent = line.sentAt !== null;

              // sendte linjer kan ikke rettes
              if (isSent) {
                return (
                  <li key={line.lineId} className="py-4 opacity-55">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-medium">
                        {line.quantity} × {toTitleCase(line.item.name)}
                      </p>
                      <span className="text-sm tabular-nums">{formatPrice(line.item.price * line.quantity)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Sendt{line.note && ` · ${line.note}`}</p>
                  </li>
                );
              }

              return (
                <li key={line.lineId} className="space-y-3 py-4">
                  {/* Row 1: name + price on the left, quantity stepper on the right */}
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{toTitleCase(line.item.name)}</p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {formatPrice(line.item.price * line.quantity)}
                      </p>
                    </div>

                    {/* size-11 = 44px: Apple's minimum recommended touch target */}
                    <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-11 bg-background"
                        aria-label="Én mindre"
                        onClick={() => onChangeQuantity(line.lineId, -1)}
                      >
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-lg font-semibold tabular-nums">{line.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-11 bg-background"
                        aria-label="Én mere"
                        onClick={() => onChangeQuantity(line.lineId, 1)}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>

                  {/* Row 2: note + remove. "Fjern" lives down here, on purpose far away from "+",
                      so a slip of the finger can't delete a dish. */}
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-11 flex-1"
                      placeholder="Note, fx uden løg"
                      value={line.note}
                      onChange={(e) => onNote(line.lineId, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      className="h-11 gap-1.5 px-3 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemove(line.lineId)}
                    >
                      <Trash2 />
                      Fjern
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Fixed footer: total + actions */}
      <div className="shrink-0 space-y-3 border-t px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-heading text-2xl font-medium tabular-nums">{formatPrice(total)}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="h-14 flex-1" onClick={onCancel} disabled={unsentCount === 0}>
            Annullér
          </Button>
          {/* flex-2: the main action is twice as wide as "cancel" */}
          <Button className="h-14 flex-2 text-base" onClick={onSend} disabled={unsentCount === 0}>
            Send til køkken{unsentCount > 0 && ` (${unsentCount})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
