import { useState } from "react";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReservation } from "../../features/Reservation/reservationApi";

// Today's date as "yyyy-mm-dd" in local time.
// (toISOString() would use UTC and could give yesterday's date just after midnight.)
function todayIso() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

// Every field is stored as a string, because that is what <input> gives us.
// We convert to the right types only when sending.
function emptyForm() {
  return {
    customerName: "",
    customerPhone: "",
    resDate: todayIso(),
    resTime: "",
    numberOfGuests: "",
    specialRequest: "",
  };
}

// "2026-10-24" -> "24/10/2026" (only for display; the value stays yyyy-mm-dd)
function formatDate(iso: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm";

type PickerFieldProps = {
  type: "date" | "time";
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  display: string; // the text we show, e.g. "24/10/2026"
  placeholder: string; // shown when nothing is chosen yet
  icon: React.ReactNode;
  min?: string;
  step?: number;
};

// A date/time field where the WHOLE box is clickable.
// Trick: what you see is a plain div with our own text and icon.
// On top of it lies the real <input>, stretched to the same size but invisible
// (opacity-0). Clicking anywhere hits the input, and showPicker() opens the
// browser's own calendar/clock.
function PickerField({
  display,
  placeholder,
  icon,
  value,
  ...inputProps
}: PickerFieldProps) {
  return (
    <div className="relative">
      <div className={`${fieldClass} flex items-center justify-between`}>
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? display : placeholder}
        </span>
        {icon}
      </div>

      <input
        {...inputProps}
        value={value}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker(); // open the picker, not only on the small icon
          } catch {
            // older browsers: they just focus the field instead
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

export default function NewReservationForm() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const queryClient = useQueryClient();

  // useMutation = React Query's tool for CHANGING data (useQuery is for reading)
  const mutation = useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      // Marks every query whose key starts with "reservations" as stale,
      // so the table on the right fetches the list again by itself.
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setForm(emptyForm());
      setError(null);
      setSaved(true);
    },
    onError: (err) => {
      setSaved(false);
      setError(err.message || "Kunne ikke gemme reservationen");
    },
  });

  // One handler for every field: it uses the field's "name" to know what to update
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser from reloading the page

    // Check in the browser first, so the waiter gets instant feedback.
    // The backend checks the same rules (@NotBlank, @NotNull, @Min).
    if (!form.customerName.trim()) return setError("Navn er påkrævet");
    if (!form.resDate) return setError("Vælg en dato");
    if (!form.resTime) return setError("Vælg et tidspunkt");
    if (!form.numberOfGuests) return setError("Vælg antal gæster");

    mutation.mutate({
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim() || null, // empty -> null
      resDate: form.resDate, // "2026-11-22" -> LocalDate
      resTime: form.resTime, // "18:30"      -> LocalTime
      numberOfGuests: Number(form.numberOfGuests), // "4"          -> 4
      specialRequest: form.specialRequest.trim() || null,
    });
  }

  const labelClass = "flex flex-col gap-2 text-sm text-gray-900";
  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400";

  return (
    <section className="w-full rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">Ny reservation</h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <label className={labelClass}>
          Navn
          <input
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Gæstens fulde navn"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Telefonnummer
          <input
            name="customerPhone"
            type="tel"
            value={form.customerPhone}
            onChange={handleChange}
            placeholder="Fx 12 34 56 78"
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className={labelClass}>
            Dato
            <PickerField
              type="date"
              name="resDate"
              min={todayIso()} // can't book in the past
              value={form.resDate}
              onChange={handleChange}
              display={formatDate(form.resDate)}
              placeholder="Vælg dato"
              icon={<CalendarIcon className="size-4 text-gray-500" />}
            />
          </label>

          <label className={labelClass}>
            Tidspunkt
            <PickerField
              type="time"
              name="resTime"
              min="00:00"
              step={900} // 15-minute steps
              value={form.resTime}
              onChange={handleChange}
              display={form.resTime}
              placeholder="Vælg tid"
              icon={<ClockIcon className="size-4 text-gray-500" />}
            />
          </label>
        </div>

        <label className={labelClass}>
          Antal gæster
          <select
            name="numberOfGuests"
            value={form.numberOfGuests}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Vælg antal</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Bemærkninger (valgfrit)
          <textarea
            name="specialRequest"
            rows={3}
            value={form.specialRequest}
            onChange={handleChange}
            placeholder="Fx barnestol eller særlige ønsker"
            className={inputClass}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && (
          <p className="text-sm text-green-700">Reservationen er gemt.</p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-[#5A6B2A] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {mutation.isPending ? "Gemmer..." : "Gem reservation"}
        </button>
      </form>
    </section>
  );
}
