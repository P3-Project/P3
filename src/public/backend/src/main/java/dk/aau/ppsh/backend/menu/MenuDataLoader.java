package dk.aau.ppsh.backend.menu;

import java.io.InputStream;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

@Component
public class MenuDataLoader implements CommandLineRunner {

    private final MenuItemRepository repo;
    private final JsonMapper jsonMapper;

    public MenuDataLoader(MenuItemRepository repo, JsonMapper jsonMapper) {
        this.repo = repo;
        this.jsonMapper = jsonMapper;
    }

    @Override
    public void run(String... args) throws Exception {
        if (repo.count() > 0) {
            return;
        }

        try (InputStream in = new ClassPathResource("data/menu.json").getInputStream()) {
            List<MenuItemJson> items = jsonMapper.readValue(in, new TypeReference<List<MenuItemJson>>() {
            });

            List<MenuItem> entities = items.stream()
                    .map(j -> new MenuItem(j.name(), j.price(), j.description(), j.category(), j.charcoalGrill()))
                    .toList();

            repo.saveAll(entities);
            System.out.println("Imported " + entities.size() + " menu items from menu.json");

        }
    }

}
