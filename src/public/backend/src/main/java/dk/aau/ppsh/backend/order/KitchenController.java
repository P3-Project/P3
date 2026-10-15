package dk.aau.ppsh.backend.order;

import dk.aau.ppsh.backend.order.OrderDtos.KitchenItemDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {
    private final OrderService service;

    public KitchenController(OrderService service) {this.service = service;}

    @GetMapping
    public List<KitchenItemDto> queue(@RequestParam(required = false) String station){
        return service.kitchenQueue(station);
    }

    @PostMapping("/items/{orderItemId}/complete")
    @ResponseStatus(HttpStatus.NO_CONTENT) // 204: succes, nothing to return
    public void complete(@PathVariable Integer orderItemId){
        service.completeItem(orderItemId);
    }
}
