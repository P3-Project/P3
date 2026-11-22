
import type { Reservation } from "../../features/Reservation/reservationApi";

type UpcomingReservationsProps = {
  reservations: Reservation[];
};

export default function UpcomingReservations({
  reservations,
}: UpcomingReservationsProps) {
    
    const totalReservations = reservations.length;

    const totalGuests = reservations.reduce(
        (total, reservation) => total + reservation.numberOfGuests,
        0
    );

    const today = new Date();
    
    const formattedDate = today.toLocaleDateString("da-DK", {
        weekday: "long", 
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
    
    <section className="w-full rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-gray-900">
            Kommende reservationer
        </h2>

        <p className="mt-2 text-sm text-gray-500">
            {formattedDate}
        </p>
        
        <table  className="mt-6 w-full border-collapse text-left">
            <thead className="bg-[#F8F4EE] text-gray-900">
                <tr className="border-b border-gray-200">
                <th className="px-4 py-4 text-left">Tid</th>
                <th className="px-4 py-4 text-left">Navn</th>
                <th className="px-4 py-4 text-left">Gæster</th>
                <th className="px-4 py-4 text-left">Bord</th>
                <th className="px-4 py-4 text-left">Ønsker</th>
                </tr>
            </thead>
            
            <tbody>
                {reservations.length === 0 && (
                    <tr>
                        <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-gray-500"
                        >
                            Ingen kommende reservationer
                        </td>
                    </tr>
                )}
                
                {reservations.map((reservation) => (
                    
                    <tr
                        key={reservation.reservationId}
                        className="border-b border-gray-200 hover:bg-gray-50"
                        >

                        <td className="px-4 py-6">
                            {reservation.resTime.slice(0, 5)}
                        </td>
                                    
                        <td className="px-4 py-6">
                            {reservation.customerName}
                        </td>
                        
                        <td className="px-4 py-6">
                            {reservation.numberOfGuests}
                        </td>

                        <td className="px-4 py-6">–</td>
                        
                        <td className="px-4 py-6">
                            {reservation.specialRequest || "–"}
                        </td>
                    </tr>
                ))}
                
                </tbody>

        </table>
        
        <div className="border-t border-gray-200 px-4 py-5 text-sm text-gray-500">
            {totalReservations} reservationer · {totalGuests} gæster
        </div>
        </section>
  );
}