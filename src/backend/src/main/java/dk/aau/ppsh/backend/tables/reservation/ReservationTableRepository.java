package dk.aau.ppsh.backend.tables.reservation;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationTableRepository extends JpaRepository<ReservationTable, ReservationTableId> {
    
    list<ReservationTable> findByIdReservationId(Integer reservationId);
    
}
