package dk.aau.ppsh.backend.order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

  // All lines on one order
    List<OrderItem> findByOrderId(Integer orderId);

    // Items that have been sent to the kitchen but aren't done, oldest first
    List<OrderItem> findBySentAtIsNotNullAndCompletedFalseOrderBySentAtAsc();

    // All Unfinished items belonging to one order
    List<OrderItem> findByOrderIdAndCompletedFalse(Integer orderId);
}
