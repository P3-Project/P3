package dk.aau.ppsh.backend.menu;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;



public interface MenuItemRepository extends JpaRepository<MenuItem, Integer>{
    // Spring writes the SQL from the method name: WHERE dish_number = ?
    Optional<MenuItem> findByDishNumber(String dishNumber);
}


