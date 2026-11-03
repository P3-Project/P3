package dk.aau.ppsh.backend.order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // Everything the kitchen should be making right now, oldest first.
    @Query("""
    SELECT oi FROM OrderItem oi
    JOIN FETCH oi.restaurantOrder o
    JOIN FETCH o.restaurantTable
    JOIN FETCH oi.menuItem
    WHERE oi.sentAt IS NOT NULL
      AND oi.completed = false
      AND oi.voidedAt IS NULL
      AND o.closedAt IS NULL
      AND o.cancelledAt IS NULL
    ORDER BY oi.sentAt ASC
    """)
    List<OrderItem> findPendingForKitchen();

    // Cancelled dishes the kitchen hasn't confirmed yet (the 3-minute rule is applied in OrderService)
    @Query("""
    SELECT oi FROM OrderItem oi
    JOIN FETCH oi.restaurantOrder o
    JOIN FETCH o.restaurantTable
    JOIN FETCH oi.menuItem
    WHERE oi.voidedAt IS NOT NULL
      AND oi.voidAcknowledged = false
      AND oi.completed = false
    ORDER BY oi.voidedAt ASC
    """)
    List<OrderItem> findUnacknowledgedVoids();
}
