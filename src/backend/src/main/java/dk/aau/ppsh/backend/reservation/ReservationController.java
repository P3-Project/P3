package dk.aau.ppsh.backend.reservation;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dk.aau.ppsh.backend.reservation.ReservationDtos.ReservationRequest;
import dk.aau.ppsh.backend.reservation.ReservationService.ReservationDto;
import jakarta.validation.Valid;



@RestController
@RequestMapping("/api/reservations")
public class ReservationController {


    private final ReservationService service; 

    public ReservationController(ReservationService service) { this.service = service; }

    // GET /api/reservations             -> all reservations
    // GET /api/reservations?date=2026-10-12 -> that day's, sorted by time
    @GetMapping
    public List<ReservationDto> all(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "false") boolean upcoming) {
                return service.list(date, upcoming);
            }

// POST /api/reservations -> "Gem Reservation" create a reservation (without tables)
  @PostMapping
  public ReservationDto create(@Valid @RequestBody ReservationRequest req) {

    return service.create(req);
  }

// PUT /api/reservations/3 -> the pencil: change, only while booked
   @PutMapping("/{id}")
   public ReservationDto change(@PathVariable int id, @Valid @RequestBody ReservationRequest req) {

    return service.change(id, req);
   }

// DELETE /api/reservations/3 -> the bin: cancel (booked => cancelled, the row is kept)
 @DeleteMapping("/{id}")
   public ReservationDto cancel(@PathVariable int id) {

    return service.cancel(id);
}

// Body of the POST /api/reservations/{id}/tables, for example: {"tables": [7,8] or [9,8]}
public record AssignTablesRequest(List<Integer> tables) {}


// POST /api/reservations/3/tables => Assigns tables (stays booked)

@PostMapping("/{id}/tables")
   public ReservationDto assignTables(@PathVariable int id, @Valid @RequestBody AssignTablesRequest body) {

    return service.assignTables(id, body.tables());
   }

  // POST /api/reservations/3/ arrived => booked => seated (needs a table)
  @PostMapping("/{id}/arrived")
   public ReservationDto arrived(@PathVariable int id) {

    return service.markArrived(id);
   }

     // POST /api/reservations/3/ left => seated => completed
  @PostMapping("/{id}/left")
   public ReservationDto left(@PathVariable int id) {

    return service.markLeft(id);
   }

        // POST /api/reservations/3/ no-show => booked => no_show
@PostMapping("/{id}/no-show")
   public ReservationDto noShow(@PathVariable int id) {

    return service.markNoShow(id);
   }

}