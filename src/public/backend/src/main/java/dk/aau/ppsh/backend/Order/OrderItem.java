package dk.aau.ppsh.backend.order;
import jakarta.persistence.*;
import java.time.Instant;

@Entity

@Table(name = "order_item")
public class OrderItem {
 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // SERIAL in Postgres
    private Integer orderItemId;

    @Column(nullable = false)
    private Integer orderId;

    @Column(nullable = false)
    private Integer itemId;

    @Column(nullable = false)
    private Integer quantity;

    private String note;

    private Instant sentAt; // null until sent to the kitchen

    @Column(nullable = false)
    private boolean completed;

    protected OrderItem() {} // JPA needs an empty constructor

    public OrderItem(Integer orderId, Integer itemId, Integer quantity, String note) {
        this.orderId = orderId;
        this.itemId = itemId;
        this.quantity = quantity;
        this.note = note;
        this.completed = false;
    }

    public Integer getOrderItemId() { return orderItemId; }
    public Integer getOrderId() { return orderId; }
    public Integer getItemId() { return itemId; }
    public Integer getQuantity() { return quantity; }
    public String getNote() { return note; }
    public Instant getSentAt() { return sentAt; }
    public boolean isCompleted() { return completed; }


}