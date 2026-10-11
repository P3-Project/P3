package dk.aau.ppsh.backend.menu;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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