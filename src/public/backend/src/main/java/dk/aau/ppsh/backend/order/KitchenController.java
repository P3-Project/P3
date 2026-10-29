package dk.aau.ppsh.backend.order;

import dk.aau.ppsh.backend.order.OrderDtos.KitchenItemDto;
import dk.aau.ppsh.backend.order.OrderDtos.KitchenVoidDto;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
public class KitchenController {
    private final OrderService service;

    public KitchenController(OrderService service) {this.service = service;}

    // GET /api/kitchen/voided?station=PIZZA -> cancellations the kitchen must see
    @GetMapping("/voided")
    public List<KitchenVoidDto> voided(@RequestParam(required = false) String station) {
        return service.kitchenVoidNotices(station);
    }

    @PostMapping("/items/{orderItemId}/acknowledge")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void acknowledge(@PathVariable Integer orderItemId) {
        service.acknowledgeVoid(orderItemId);
    }

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
