package dk.aau.ppsh.backend.reservation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    // Spring writes the SQL from the method name:
    // SELECT * FROM reservation WHERE res_date = ? ORDER BY res_time
    List<Reservation> findByResDateOrderByResTime(LocalDate resDate);
}