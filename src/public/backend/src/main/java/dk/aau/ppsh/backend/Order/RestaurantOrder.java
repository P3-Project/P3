package dk.aau.ppsh.backend.order;

import dk.aau.ppsh.backend.menu.RestaurantTable;
import dk.aau.ppsh.backend.staff.Staff;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Maps to the 'restaurant_order' table created in V5
@Entity
@Table(name = "restaurant_order")
public class RestaurantOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "table_number")
    private RestaurantTable restaurantTable;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "waiter_id")
    private Staff waiter;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // One order contains many order items. The foreign key lives in order_item, hence mappedBy.
    @OneToMany(mappedBy = "restaurantOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderItemId")
    private List<OrderItem> items = new ArrayList<>();

    protected RestaurantOrder() {} // JPA needs an empty constructor

    public RestaurantOrder(RestaurantTable restaurantTable, Staff waiter) {
        this.restaurantTable = restaurantTable;
        this.waiter = waiter;
    }

    public boolean isOpen() { return closedAt == null && cancelledAt == null; }

    public String getStatus() {
        if (cancelledAt != null) return "CANCELLED";
        if (closedAt != null) return "CLOSED";
        return "OPEN";
    }

    public Integer getOrderId() { return orderId; }
    public RestaurantTable getRestaurantTable() { return restaurantTable; }
    public Staff getWaiter() { return waiter; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getClosedAt() { return closedAt; }
    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public List<OrderItem> getItems() { return items; }

    public void close() { this.closedAt = LocalDateTime.now(); }
    public void cancel() { this.cancelledAt = LocalDateTime.now(); }
}
