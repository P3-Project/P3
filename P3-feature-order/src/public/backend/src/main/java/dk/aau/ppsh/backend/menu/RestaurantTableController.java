package dk.aau.ppsh.backend.menu;

import org.springframework.web.bind.annotation.*;
import java.util.List;


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
}
