package dk.aau.ppsh.backend.Order;

import dk.aau.ppsh.backend.Order.OrderDtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;

    public OrderController(OrderService service) { this.service = service; }

    // GET /api/orders             -> all orders, newest first
    // GET /api/orders?open=true   -> only open orders
    @GetMapping
    public List<OrderDto> all(@RequestParam(defaultValue = "false") boolean open) {
        return service.list(open);
    }

    @GetMapping("/{orderId}")
    public OrderDto one(@PathVariable Integer orderId) { return service.get(orderId); }

    // Start an order for a table
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto create(@Valid @RequestBody CreateOrderRequest req) { return service.create(req); }

    @PostMapping("/{orderId}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto addItem(@PathVariable Integer orderId, @Valid @RequestBody AddItemRequest req) {
        return service.addItem(orderId, req);
    }

    @PutMapping("/{orderId}/items/{orderItemId}")
    public OrderDto updateItem(@PathVariable Integer orderId, @PathVariable Integer orderItemId,
                               @Valid @RequestBody UpdateItemRequest req) {
        return service.updateItem(orderId, orderItemId, req);
    }

    @DeleteMapping("/{orderId}/items/{orderItemId}")
    public OrderDto removeItem(@PathVariable Integer orderId, @PathVariable Integer orderItemId) {
        return service.removeItem(orderId, orderItemId);
    }

    // Send all new items to the kitchen
    @PostMapping("/{orderId}/send")
    public OrderDto send(@PathVariable Integer orderId) { return service.send(orderId); }

    @PostMapping("/{orderId}/close")
    public OrderDto close(@PathVariable Integer orderId) { return service.close(orderId); }

    @PostMapping("/{orderId}/cancel")
    public OrderDto cancel(@PathVariable Integer orderId) { return service.cancel(orderId); }
}
