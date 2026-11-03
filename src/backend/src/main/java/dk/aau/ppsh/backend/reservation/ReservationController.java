package dk.aau.ppsh.backend.reservation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository repo;

    public ReservationController(ReservationRepository repo) { this.repo = repo; }

    // GET /api/reservations             -> all reservations
    // GET /api/reservations?date=2026-10-12 -> that day's, sorted by time
    @GetMapping
    public List<Reservation> all(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            return repo.findAll();
        }
        return repo.findByResDateOrderByResTime(date);
    }
        // POST /api/reservations -> create a reservation
       @PostMapping
    public Reservation create(@Valid @RequestBody Reservation reservation) {
        reservation.setReservationId(null);   // the database assigns it
        reservation.setStatus("booked");      // new reservations always start here
        if (reservation.getDuration() == null) {
            reservation.setDuration(120);
        }
        return repo.save(reservation);
    }


}