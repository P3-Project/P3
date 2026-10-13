package dk.aau.ppsh.backend.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // All lines on one order
    List<OrderItem> findByRestaurantOrderOrderId(Integer orderId);

    // The kitchen screen: items the waiter has sent that are not done yet, oldest first.
    // Items on closed or cancelled orders are left out.
    @Query("""
        select oi from OrderItem oi
        join fetch oi.restaurantOrder o
        join fetch o.restaurantTable
        join fetch oi.menuItem
        where oi.sentAt is not null
          and oi.completed = false
          and o.closedAt is null
          and o.cancelledAt is null
        order by oi.sentAt, oi.orderItemId
        """)
    List<OrderItem> findPendingForKitchen();
}