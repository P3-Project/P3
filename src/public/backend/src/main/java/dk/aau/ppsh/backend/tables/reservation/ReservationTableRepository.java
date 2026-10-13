package dk.aau.ppsh.backend.tables.reservation;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationTableRepository extends JpaRepository<ReservationTable, ReservationTableId> {
    
}
