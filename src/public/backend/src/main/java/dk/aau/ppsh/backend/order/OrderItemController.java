package dk.aau.ppsh.backend.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {
    private final OrderItemRepository repo;

    public OrderItemController(OrderItemRepository repo) {
        this.repo = repo;
    }

    // What the frontend sends when the waiter adds a dish
    public record NewOrderItem(
            @NotNull Integer orderId,
            @NotNull Integer itemId,
            @NotNull @Min(1) Integer quantity,
            String note) {
    }

    // GET /api/order-items?orderId=1
    @GetMapping
    public List<OrderItem> byOrder(@RequestParam Integer orderId) {
        return repo.findByOrderId(orderId);
    }

    // POST /api/order-items
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderItem add(@Valid @RequestBody NewOrderItem body) {
        OrderItem item = new OrderItem(body.orderId(), body.itemId(), body.quantity(), body.note());
        return repo.save(item);
    }
}