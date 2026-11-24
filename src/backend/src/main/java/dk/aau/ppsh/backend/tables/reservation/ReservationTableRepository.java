package dk.aau.ppsh.backend.tables.reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ReservationTableRepository extends JpaRepository<ReservationTable, ReservationTableId> {
    
/** 
 * One table is assigned for a reservation. A large group of guests gets one row per table according to (M.8).
 * Waiter does not assign table in advance, but when guests arrives
 * they get the table, that they request, or the waiter does it for them. 
 * The free_table check is repeated inside so two waiters cannot give the same table at the same time,
 * it will return with 0 if the table is taken. 
 * This prevents guests getting the same tables.  
*/

@Modifying
@Query(value = """
             INSERT INTO reservation_table (reservation_id, table_number)
             SELECT r.reservation_id, t.table_number
             FROM reservation r
             JOIN restaurant_table t ON t.table_number = :tableNumber
             WHERE r.reservation_id = :reservationId
                AND r.status = 'booked'
                AND NOT EXISTS (
                    SELECT 1
                    FROM reservation_table rt
                    JOIN reservation o ON o.reservation_id = rt.reservation_id
                    WHERE rt.table_number = t.table_number
                    AND o.reservation_id <> r.reservation_id
                    AND o.status IN ('booked', 'seated')
                    AND (o.res_date + o.res_time)
                        < (r.res_date + r.res_time + make_interval(mins => r.duration))
                    AND (r.res_date + r.res_time)
                        < (o.res_date + o.res_time + make_interval(mins => o.duration))
)
    ON CONFLICT DO NOTHING
    """, nativeQuery = true)

    int addTable(@Param("reservationId") int reservationId,
                 @Param("tableNumber") int tableNumber);

/** The tables a reservation was given, example: [7,8] or [8,9] */

@Query(value = """
               SELECT table_number
               FROM reservation_table
               WHERE reservation_id = :reservationId
               ORDER BY table_number
               """, nativeQuery = true)

               List<Integer> findTableNumbers(@Param("reservationId") int reservationId);

               // Every reservation_table row for one reservation
               List<ReservationTable> findByIdReservationId(Integer reservationId);
}
