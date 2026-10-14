package dk.aau.ppsh.backend;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import dk.aau.ppsh.backend.order.OrderService;
import dk.aau.ppsh.backend.order.OrderDtos.KitchenItemDto;
import java.util.List;

// What the kitchen screen uses
@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {
    private final OrderService service;

    public KitchenController(OrderService service) { this.service = service; }

    // Sent items that are not done yet, oldest first
    @GetMapping
    public List<KitchenItemDto> queue() { return service.kitchenQueue(); }

    // The kitchen marks one item as done
    @PostMapping("/items/{orderItemId}/complete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void complete(@PathVariable Integer orderItemId) { service.completeItem(orderItemId); }
}