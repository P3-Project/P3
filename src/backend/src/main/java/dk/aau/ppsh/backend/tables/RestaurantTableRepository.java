package dk.aau.ppsh.backend.tables;

import java.util.List;

import java.time.LocalDate;
import java.time.LocalTime;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// Spring generates findAll(), findById(), save(), etc. for us
// <RestaurantTable, Integer>: works with RestaurantTable objects whose id (table_number) is an Integer
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {

    // Spring writes the SQL from the method name:
    // SELECT * FROM restaurant_table WHERE seats >= ?
    List<RestaurantTable> findBySeatsGreaterThanEqual(Integer seats);

    /**
     * Find the tables that are free for a booking of :guests people, starting at
     * :resDate :resTime and lasting :durationMinutes minutes.
     *
     * A table is free when no reservation that uses it overlaps the new booking.
     * Two periods overlap when each one starts before the other one ends, so BOTH
     * comparisons below are needed: with only one of them, a reservation that lies
     * completely inside the new booking would not be found.
     *
     * res_date + res_time is added together into a timestamp so that a late booking
     * (for example 23:00 + 120 minutes) does not wrap around midnight and compare wrongly.
     *
     * Cancelled and no-show reservations release their table again, so they are skipped.
     * excludeId lets an existing reservation be edited without blocking itself; pass null
     * when creating a new one.
     *
     * The result is ordered by seats, so the smallest table that fits comes first.
     * This follows how PPSH seats guests today: four people at a table for four, and a
     * bigger table only when there is nothing smaller free (Appendix B).
     *
     * Written as native SQL because make_interval() and date + time are PostgreSQL
     * features that JPQL has no equivalent for.
     */
    @Query(value = """
            SELECT t.*
            FROM restaurant_table t
            WHERE t.seats >= :guests
              AND NOT EXISTS (
                  SELECT 1
                  FROM reservation_table rt
                  JOIN reservation r ON r.reservation_id = rt.reservation_id
                  WHERE rt.table_number = t.table_number
                    AND r.status NOT IN ('cancelled', 'no_show')
                    AND (:excludeId IS NULL OR r.reservation_id <> :excludeId)
                    AND (r.res_date + r.res_time)
                          < (CAST(:resDate AS date) + CAST(:resTime AS time)
                             + make_interval(mins => :durationMinutes))
                    AND (CAST(:resDate AS date) + CAST(:resTime AS time))
                          < (r.res_date + r.res_time + make_interval(mins => r.duration))
              )
            ORDER BY t.seats, t.table_number
            """, nativeQuery = true)
    List<RestaurantTable> findAvailableTables(
            @Param("resDate") LocalDate resDate,
            @Param("resTime") LocalTime resTime,
            @Param("durationMinutes") int durationMinutes,
            @Param("guests") int guests,
            @Param("excludeId") Integer excludeId);

    /**
     * The tables that are occupied right now, used by the table overview (S.2).
     * A table counts as occupied when a reservation is seated, or when a booked
     * reservation's period covers the given time.
     */
    @Query(value = """
            SELECT t.*
            FROM restaurant_table t
            WHERE EXISTS (
                  SELECT 1
                  FROM reservation_table rt
                  JOIN reservation r ON r.reservation_id = rt.reservation_id
                  WHERE rt.table_number = t.table_number
                    AND r.res_date = CAST(:resDate AS date)
                    AND r.status IN ('booked', 'seated')
                    AND (r.res_date + r.res_time) <= (CAST(:resDate AS date) + CAST(:resTime AS time))
                    AND (CAST(:resDate AS date) + CAST(:resTime AS time))
                          < (r.res_date + r.res_time + make_interval(mins => r.duration))
            )
            ORDER BY t.table_number
            """, nativeQuery = true)
    List<RestaurantTable> findOccupiedTables(
            @Param("resDate") LocalDate resDate,
            @Param("resTime") LocalTime resTime);
}
