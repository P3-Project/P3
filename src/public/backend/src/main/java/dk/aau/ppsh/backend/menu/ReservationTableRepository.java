package dk.aau.ppsh.backend.menu;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationTableRepository extends JpaRepository<ReservationTable, ReservationTableId> {
    
}
