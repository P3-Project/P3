package dk.aau.ppsh.backend.menu;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/api/menu")
public class MenuItemController {
    
    private final MenuItemRepository repo;

public MenuItemController(MenuItemRepository repo) {
this.repo = repo;
}


@GetMapping 
public List<MenuItem> all() {
    return repo.findAll();

}

}