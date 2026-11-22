import { apiClient } from "../../lib/api-client";

export type Reservation = {
  reservationId: number;
  customerName: string;
  customerPhone: string | null;
  resDate: string;
  resTime: string;
  duration: number | null;
  numberOfGuests: number;
  specialRequest: string | null;
  status: string;
};

export function getReservations(date: string) {
  return apiClient<Reservation[]>(
    `/reservations?date=${encodeURIComponent(date)}`
  );
}

// Fetches every reservation dated BEFORE the given day (yyyy-mm-dd)
export async function getPastReservations(before: string): Promise<Reservation[]> {
  const res = await fetch(`/api/reservations?before=${before}`);
  if (!res.ok) throw new Error("Kunne ikke hente tidligere reservationer");
  return res.json();
}