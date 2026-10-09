package dk.aau.ppsh.backend.menu;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Spring generates findAll(), findById(), save(), etc. for us
// <RestaurantTable, Integer>: works with RestaurantTable objects whose id (table_number) is an Integer
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {
    
    // Spring writes the SQL from the method name:
    // SELECT * FROM restaurant_table WHERE seats >= ?
    List<RestaurantTable> findBySeatsGreaterThanEqual(Integer seats);
}
