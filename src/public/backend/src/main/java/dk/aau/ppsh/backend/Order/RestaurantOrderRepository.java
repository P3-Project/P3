package dk.aau.ppsh.backend.Order;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RestaurantOrderRepository extends JpaRepository<RestaurantOrder, Integer> {

    // Open = neither closed nor cancelled. Spring writes the SQL from the method name.
    List<RestaurantOrder> findByClosedAtIsNullAndCancelledAtIsNullOrderByCreatedAtAsc();

    List<RestaurantOrder> findAllByOrderByCreatedAtDesc();

    Optional<RestaurantOrder> findByRestaurantTableTableNumberAndClosedAtIsNullAndCancelledAtIsNull(Integer tableNumber);
}
