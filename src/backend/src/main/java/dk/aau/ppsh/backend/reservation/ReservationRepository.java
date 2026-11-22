package dk.aau.ppsh.backend.reservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    // Spring writes the SQL from the method name:
    // SELECT * FROM reservation WHERE res_date = ? ORDER BY res_time
    List<Reservation> findByResDateOrderByResTime(LocalDate resDate);

    /**
     * The same day, but without the statuses the caller is not interested in.
     * The waiter's view passes "cancelled" and "no_show" so that the list only
     * shows the guests who are still expected.
     */
    List<Reservation> findByResDateAndStatusNotInOrderByResTime(
            LocalDate resDate, Collection<String> statuses);

    /** All reservations for one day with one status, for example every seated table. */
    List<Reservation> findByResDateAndStatusOrderByResTime(LocalDate resDate, String status);

    /**
     * Reservations that were booked for today, whose time has already passed, and where
     * the guests have not been marked as arrived. Øcal removes a reservation when the
     * guests are more than 30 minutes late (Appendix B), so the view calls this with
     * LocalTime.now().minusMinutes(30) and offers to mark them as no-show.
     */
    @Query("""
            SELECT r FROM Reservation r
            WHERE r.resDate = :resDate
              AND r.status = 'booked'
              AND r.resTime < :cutoff
            ORDER BY r.resTime
            """)
    List<Reservation> findLateArrivals(@Param("resDate") LocalDate resDate,
                                       @Param("cutoff") LocalTime cutoff);

    /**
     * How many guests are expected for a day, used for the daily overview.
     * Cancelled and no-show reservations are not counted.
     */
    @Query("""
            SELECT COALESCE(SUM(r.numberOfGuests), 0) FROM Reservation r
            WHERE r.resDate = :resDate
              AND r.status NOT IN ('cancelled', 'no_show')
            """)
    int countExpectedGuests(@Param("resDate") LocalDate resDate);
        

/** 
 * Each UPDATE changes the row only when it is in the expected status, 
 * and returns the rows, that are changed. 0 is when the change was rejected. 
 * clearAutomatically is when the service reads the reservation again after and gets a new value, not the old copy of JPA.
*/

@Modifying(clearAutomatically = true)
@Query(value = """
        UPDATE reservation
        SET status = :toStatus
        WHERE reservation_id = :reservationId
        AND status = :fromStatus
        """, nativeQuery = true)

int changeStatus(@Param("reservationId") int reservationId,
                 @Param("fromStatus") String fromStatus,
                 @Param("toStatus") String toStatus);


/** When guests arrives: booked ---> seated, only when the reservation has an available table. */
@Modifying(clearAutomatically = true)
@Query(value = """
        UPDATE reservation
        SET status = 'seated'
        WHERE reservation_id = :reservationId
        AND status = 'booked'
        AND EXISTS (SELECT 1 FROM reservation_table
                        WHERE reservation_id = :reservationId)
        """, nativeQuery = true)

        int markSeated(@Param("reservationId") int reservation_id);


/** Change of the details. Can only be done while the reservation is still booked */
Modifying(clearAutomatically = true)
@Query(value = """
        UPDATE reservation
        SET customer_name       = :customerName,
            customer_phone      = :customerPhone,
            res_date            = :resDate,
            res_time            = :resTime,
            duration            = :duration,
            number_of_guests    = :numberOfGuests,
            special_request     = :specialRequest
                        WHERE reservation_id = :reservationId)
        """, nativeQuery = true)

        int markSeated(@Param("reservationId") int reservation_id);



}