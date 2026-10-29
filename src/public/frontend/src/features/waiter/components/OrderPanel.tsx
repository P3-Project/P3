import { useState } from "react";
import { Minus, Plus, Receipt, Trash2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, toTitleCase } from "@/lib/format";
import type { OrderLine } from "../types";

type Props = {
  lines: OrderLine[];
  isSaving: boolean; // a request is on its way to the server
  error: string | null; // last error from the server, e.g. "Moro er udsolgt"
  onChangeQuantity: (line: OrderLine, delta: number) => void;
  onRemove: (line: OrderLine) => void; // not sent yet: simply deleted
  onVoid: (line: OrderLine) => void; // already sent: cancelled, and the kitchen is told
  onNote: (line: OrderLine, note: string) => void;
  onSend: () => void;
  onCancel: () => void; // remove everything not sent yet
  onClose: () => void; // the table has paid
};

// The order for the selected table, in the right-hand column.
// Header and footer are fixed; only the list in the middle scrolls,
// so "Send til køkken" is ALWAYS visible without scrolling.
export default function OrderPanel({ lines, isSaving, error, onChangeQuantity, onRemove, onVoid, onNote, onSend, onCancel, onClose }: Props) {
  // samlet pris for hele ordren (cancelled dishes are not billed)
  const total = lines.filter((l) => !l.voidedAt).reduce((sum, line) => sum + line.price * line.quantity, 0);
  // knapperne skal kun virke hvis der er noget der ikke er sendt
  const unsentCount = lines.filter((l) => l.sentAt === null).length;
  // Everything is sent -> the next step for this table is paying
  const readyToClose = lines.length > 0 && unsentCount === 0;

  return (
    <div className="flex h-full flex-col">
      {/* h-16: same height as the header rows in the other two columns, so they line up */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
        <h2 className="font-heading text-xl font-medium">Ordre</h2>
        {isSaving && <span className="text-sm text-muted-foreground">Gemmer...</span>}
      </div>

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

              // Sent lines can't be edited any more, only removed (with a confirmation)
              if (isSent) return <SentLine key={line.orderItemId} line={line} onVoid={() => onVoid(line)} />;

              return (
                <li key={line.orderItemId} className="space-y-3 py-4">
                  {/* Row 1: name + price on the left, quantity stepper on the right */}
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{toTitleCase(line.name)}</p>
                      <p className="text-sm text-muted-foreground tabular-nums">{formatPrice(line.price * line.quantity)}</p>
                    </div>

                    {/* size-11 = 44px: Apple's minimum recommended touch target */}
                    <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
                      <Button variant="ghost" size="icon" className="size-11 bg-background" aria-label="Én mindre" onClick={() => onChangeQuantity(line, -1)}>
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-lg font-semibold tabular-nums">{line.quantity}</span>
                      <Button variant="ghost" size="icon" className="size-11 bg-background" aria-label="Én mere" onClick={() => onChangeQuantity(line, 1)}>
                        <Plus />
                      </Button>
                    </div>
                  </div>

                  {/* Row 2: note + remove. "Fjern" lives down here, on purpose far away from "+",
                      so a slip of the finger can't delete a dish. */}
                  <div className="flex items-center gap-2">
                    <NoteInput line={line} onSave={(note) => onNote(line, note)} />
                    <Button variant="ghost" className="h-11 gap-1.5 px-3 text-muted-foreground hover:text-destructive" onClick={() => onRemove(line)}>
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

      {/* Fixed footer: errors, total and actions */}
      <div className="shrink-0 space-y-3 border-t px-5 py-4">
        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex items-baseline justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-heading text-2xl font-medium tabular-nums">{formatPrice(total)}</span>
        </div>

        {readyToClose ? (
          // Everything is in the kitchen: the only thing left is the bill
          <Button variant="outline" className="h-14 w-full text-base" onClick={onClose} disabled={isSaving}>
            <Receipt />
            Betalt · luk bord
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="h-14 flex-1" onClick={onCancel} disabled={unsentCount === 0 || isSaving}>
              Annullér
            </Button>
            {/* flex-2: the main action is twice as wide as "cancel" */}
            <Button className="h-14 flex-2 text-base" onClick={onSend} disabled={unsentCount === 0 || isSaving}>
              Send til køkken{unsentCount > 0 && ` (${unsentCount})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// The note field keeps what's typed locally and only saves when the waiter leaves the field
// (or presses Enter), instead of sending a request to the server on every single keystroke.
function NoteInput({ line, onSave }: { line: OrderLine; onSave: (note: string) => void }) {
  const [note, setNote] = useState(line.note ?? "");

  function save() {
    if (note.trim() !== (line.note ?? "")) onSave(note);
  }

  return (
    <Input
      className="h-11 flex-1"
      placeholder="Note, fx uden løg"
      value={note}
      onChange={(e) => setNote(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} // Enter = done -> blur -> save
      enterKeyHint="done"
    />
  );
}

// Must match LONG_IN_KITCHEN in OrderService.java: from this many minutes, the kitchen gets a notice
const LONG_IN_KITCHEN_MINUTES = 3;

const minutesSince = (iso: string) => Math.floor((Date.now() - Date.parse(iso)) / 60_000);

// A dish that's already in the kitchen. "Fjern" first asks for confirmation right in the row
// (no pop-up), and warns if the kitchen has probably started on it.
function SentLine({ line, onVoid }: { line: OrderLine; onVoid: () => void }) {
  const [confirming, setConfirming] = useState(false);

  // Already cancelled: shown crossed out, so the waiter can see what happened
  if (line.voidedAt) {
    return (
      <li className="py-4 opacity-45">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-medium line-through">
            {line.quantity} × {toTitleCase(line.name)}
          </p>
          <span className="text-sm line-through tabular-nums">{formatPrice(line.price * line.quantity)}</span>
        </div>
        <p className="text-sm text-muted-foreground">Annulleret</p>
      </li>
    );
  }

  const minutes = minutesSince(line.sentAt!);
  const longInKitchen = !line.completed && minutes >= LONG_IN_KITCHEN_MINUTES;

  return (
    <li className="space-y-3 py-4">
      <div className="flex items-center gap-3">
        {/* Only the text is faded, so the button stays clearly tappable */}
        <div className="min-w-0 flex-1 opacity-60">
          <p className="truncate font-medium">
            {line.quantity} × {toTitleCase(line.name)}
          </p>
          <p className="text-sm text-muted-foreground">
            {line.completed ? "Lavet" : "Sendt"} · {formatPrice(line.price * line.quantity)}
            {line.note && ` · ${line.note}`}
          </p>
        </div>
        {!confirming && (
          <Button variant="ghost" className="h-11 gap-1.5 px-3 text-muted-foreground hover:text-destructive" onClick={() => setConfirming(true)}>
            <Trash2 />
            Fjern
          </Button>
        )}
      </div>

      {/* Inline confirmation: two big, clearly different buttons */}
      {confirming && (
        <div role="alertdialog" aria-label="Fjern sendt ret" className="space-y-3 rounded-xl border bg-muted/50 p-3">
          <p className="font-medium">
            Fjern {line.quantity} × {toTitleCase(line.name)}?
          </p>
          {longInKitchen ? (
            <p className="flex gap-2 text-sm text-amber-900">
              <TriangleAlert className="size-4 shrink-0 translate-y-0.5" />
              Den har været i køkkenet i {minutes} min. Køkkenet får besked.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {line.completed ? "Den er allerede lavet." : "Den forsvinder fra køkkenskærmen."}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 flex-1" onClick={() => setConfirming(false)}>
              Behold
            </Button>
            <Button
              variant="destructive"
              className="h-11 flex-1"
              onClick={() => {
                onVoid();
                setConfirming(false);
              }}
            >
              Fjern ret
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}