import { useQuery } from "@tanstack/react-query";
import NewReservationForm from "./NewReservationForm";
import UpcomingReservations from "./UpcomingReservations";
import EarlierReservations from "./EarlierReservations";
import { getReservations } from "../../features/Reservation/reservationApi";

export default function Reservation() {
  const today = new Date();
  const date = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const {
    data: reservations = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reservations", date],
    queryFn: () => getReservations(date),
  });

  // if (isLoading) return <p>Indlæser reservationer...</p>;
  // if (isError) return <p>Kunne ikke hente reservationer.</p>;

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[380px_1fr]">
        <NewReservationForm />

        {isLoading && <p>Indlæser reservationer...</p>}
        {isError && <p>Kunne ikke hente reservationer.</p>}
        {!isLoading && !isError && (
          <UpcomingReservations reservations={reservations} />
        )}
      </div>

      <EarlierReservations today={date} />
    </>
  );
}
