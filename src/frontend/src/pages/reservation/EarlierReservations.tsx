import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPastReservations } from "../../features/Reservation/reservationApi";

type EarlierReservationsProps = {
  today: string; // "yyyy-mm-dd", we fetch everything before this day
};

// Turns the backend's status values into Danish labels
const statusLabels: Record<string, string> = {
  booked: "Booket",
  seated: "Ankommet",
  completed: "Afsluttet",
  cancelled: "Aflyst",
  no_show: "Udeblev",
};

// "2026-11-03" -> "3. nov. 2026"
// Adding "T00:00" makes JS read it as local time instead of UTC
function formatDate(isoDate: string) {
  return new Date(isoDate + "T00:00").toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EarlierReservations({ today }: EarlierReservationsProps) {
  // Is the panel open or closed?
  const [isOpen, setIsOpen] = useState(false);

  const { data: reservations = [], isLoading, isError } = useQuery({
    queryKey: ["reservations", "before", today],
    queryFn: () => getPastReservations(today),
    enabled: isOpen, // only fetch once the panel is opened
  });

  return (
    <section className="mt-6 w-full rounded-xl border border-gray-200 bg-white">
      {/* The toggle button, which acts as the panel header */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-900">Tidligere reservationer</span>
        {/* The arrow rotates when the panel is open */}
        <span className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {/* The panel itself, only rendered when open */}
      {isOpen && (
        <div className="border-t border-gray-200 p-6">
          {isLoading && <p className="text-gray-500">Indlæser...</p>}
          {isError && <p className="text-red-600">Kunne ikke hente tidligere reservationer.</p>}

          {!isLoading && !isError && (
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#F8F4EE] text-gray-900">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-4">Dato</th>
                  <th className="px-4 py-4">Tid</th>
                  <th className="px-4 py-4">Navn</th>
                  <th className="px-4 py-4">Gæster</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Ønsker</th>
                </tr>
              </thead>

              <tbody>
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Ingen tidligere reservationer
                    </td>
                  </tr>
                )}

                {reservations.map((reservation) => (
                  // Slightly grey text, since these are in the past
                  <tr key={reservation.reservationId} className="border-b border-gray-200 text-gray-600">
                    <td className="px-4 py-4">{formatDate(reservation.resDate)}</td>
                    <td className="px-4 py-4">{reservation.resTime.slice(0, 5)}</td>
                    <td className="px-4 py-4">{reservation.customerName}</td>
                    <td className="px-4 py-4">{reservation.numberOfGuests}</td>
                    <td className="px-4 py-4">{statusLabels[reservation.status] ?? reservation.status}</td>
                    <td className="px-4 py-4">{reservation.specialRequest || "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}