package dk.aau.ppsh.backend.tables;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/tables")
public class RestaurantTableController {
    private final RestaurantTableRepository repo;

    public RestaurantTableController(RestaurantTableRepository repo) { this.repo = repo; } // Injected by Spring

    // GET /api/tables            -> all tables
    // GET /api/tables?minSeats=4 -> only tables with 4+ seats
    @GetMapping
    public List<RestaurantTable> all(@RequestParam(required = false) Integer minSeats){
        if(minSeats == null){
            return repo.findAll(); // Returned as JSON automatically
        }
        return repo.findBySeatsGreaterThanEqual(minSeats);
    }

    // GET /api/tables/available?date=2026-11-17&time=19:00&guests=4
    // Optional: &duration=150 (defaults to 120) and &excludeReservation=3 when editing
    // an existing reservation, so it does not block itself.
    // Smallest table that fits comes first.
    @GetMapping("/available")
    public List<RestaurantTable> available(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time,
            @RequestParam int guests,
            @RequestParam(required = false, defaultValue = "120") int duration,
            @RequestParam(required = false) Integer excludeReservation) {
        return repo.findAvailableTables(date, time, duration, guests, excludeReservation);
    }

    // GET /api/tables/occupied?date=2026-11-17&time=19:00
    // The tables that are taken at that moment, for the table overview.
    @GetMapping("/occupied")
    public List<RestaurantTable> occupied(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time) {
        return repo.findOccupiedTables(date, time);
    }
}
