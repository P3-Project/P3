package dk.aau.ppsh.backend.menu;

import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/dishes")
public class DishController {
    private final DishRepository repo;

    public DishController(DishRepository repo) { this.repo = repo; } // Injected by Spring

    @GetMapping
    public List<Dish> all(){
        return repo.findAll(); // Returned as JSON automatically
    }
}
