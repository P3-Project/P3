import type { OrderLine } from "../types";

type Props = {
  lines: OrderLine[];
  onChangeQuantity: (lineId: number, delta: number) => void;
  onRemove: (lineId: number) => void;
  onNote: (lineId: number, note: string) => void;
  onSend: () => void;
  onCancel: () => void;
};

export default function OrderPanel({
  lines,
  onChangeQuantity,
  onRemove,
  onNote,
  onSend,
  onCancel,
}: Props) {
  // samlet pris for hele ordren
  const total = lines.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  );
  // knapperne skal kun virke hvis der er noget der ikke er sendt
  const unsentCount = lines.filter((l) => l.sentAt === null).length;

  return (
    <div className="card p-3">
      <h5>Ordre</h5>

      {lines.length === 0 ? (
        <p className="text-secondary">Tryk på en ret for at tilføje den.</p>
      ) : (
        <ul className="list-group list-group-flush mb-3">
          {lines.map((line) => {
            const isSent = line.sentAt !== null;

            return (
              <li
                key={line.lineId}
                className={`list-group-item ${isSent ? "text-secondary bg-light" : ""}`}
              >
                <div className="d-flex align-items-center gap-2">
                  <div className="flex-grow-1">
                    <div className="fw-bold">{line.item.name}</div>
                    <small>
                      {isSent && "Sendt · "}
                      {line.item.price * line.quantity} kr
                    </small>
                  </div>

                  {/* sendte linjer kan ikke rettes */}
                  {isSent ? (
                    <span>{line.quantity}</span>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => onChangeQuantity(line.lineId, -1)}
                      >
                        -
                      </button>
                      <span className="fw-bold">{line.quantity}</span>
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => onChangeQuantity(line.lineId, 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onRemove(line.lineId)}
                      >
                        x
                      </button>
                    </>
                  )}
                </div>

                {/* note: felt hvis ikke sendt, ellers bare tekst */}
                {isSent ? (
                  line.note && (
                    <div className="fst-italic small mt-1">{line.note}</div>
                  )
                ) : (
                  <input
                    className="form-control form-control-sm mt-2"
                    placeholder="Note til køkkenet, fx uden løg"
                    value={line.note}
                    onChange={(e) => onNote(line.lineId, e.target.value)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="d-flex justify-content-between fs-4 fw-bold mb-3">
        <span>Total</span>
        <span>{total} kr</span>
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-danger flex-grow-1"
          onClick={onCancel}
          disabled={unsentCount === 0}
        >
          Annullér
        </button>
        <button
          className="btn btn-navy flex-grow-1"
          onClick={onSend}
          disabled={unsentCount === 0}
        >
          Send til køkken
        </button>
      </div>
    </div>
  );
}
