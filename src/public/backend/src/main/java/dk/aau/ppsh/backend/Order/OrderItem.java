package dk.aau.ppsh.backend.order;

import dk.aau.ppsh.backend.menu.MenuItem;
import jakarta.persistence.*;
import java.time.LocalDateTime;

// Maps to the 'order_item' table
@Entity
@Table(name = "order_item")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Integer orderItemId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private RestaurantOrder restaurantOrder;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private MenuItem menuItem;

    private Integer quantity;
    private String note;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    private boolean completed;

    protected OrderItem() {}

    public OrderItem(RestaurantOrder restaurantOrder, MenuItem menuItem, Integer quantity, String note) {
        this.restaurantOrder = restaurantOrder;
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.note = note;
    }

    public boolean isSent() { return sentAt != null; }

    public Integer getOrderItemId() { return orderItemId; }
    public RestaurantOrder getRestaurantOrder() { return restaurantOrder; }
    public MenuItem getMenuItem() { return menuItem; }
    public Integer getQuantity() { return quantity; }
    public String getNote() { return note; }
    public LocalDateTime getSentAt() { return sentAt; }
    public boolean isCompleted() { return completed; }

    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setNote(String note) { this.note = note; }
    public void markSent() { this.sentAt = LocalDateTime.now(); }
    public void markCompleted() { this.completed = true; }
}