package dk.aau.ppsh.backend.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

// Request and response shapes of the API. Entities are never sent directly (lazy relations, internals).
public final class OrderDtos {
    private OrderDtos() {}

    // --- Requests ---
    public record CreateOrderRequest(@NotNull Integer tableNumber, @NotNull Integer waiterId) {}

    public record AddItemRequest(
        @NotNull Integer itemId,
        @NotNull @Min(1) Integer quantity,
        @Size(max = 500) String note) {}

    public record UpdateItemRequest(
        @NotNull @Min(1) Integer quantity,
        @Size(max = 500) String note) {}

    // --- Responses ---
    public record OrderItemDto(
        Integer orderItemId,
        Integer itemId,
        String name,
        Integer price,
        Integer quantity,
        String note,
        LocalDateTime sentAt,
        boolean completed) {}

    public record OrderDto(
        Integer orderId,
        Integer tableNumber,
        Integer waiterId,
        String waiterName,
        String status,           // OPEN, CLOSED or CANCELLED
        LocalDateTime createdAt,
        LocalDateTime closedAt,
        LocalDateTime cancelledAt,
        Integer total,           // sum of price * quantity over all items
        List<OrderItemDto> items) {}

    public record KitchenItemDto(
        Integer orderItemId,
        Integer orderId,
        Integer tableNumber,
        String name,
        String station,
        Integer quantity,
        String note,
        LocalDateTime sentAt) {}
}
