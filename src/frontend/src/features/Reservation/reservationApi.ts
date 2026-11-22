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
