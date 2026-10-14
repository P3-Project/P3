package dk.aau.ppsh.backend.order;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController 
@RequestMapping("/api/orders")
public class OrderItemController {
    private final OrderItemRepository repo;

    //Controlleren snakker med db via repo.
    public OrderItemController(OrderItemRepository repo){
        this.repo = repo;
    }

    @GetMapping
    public List<OrderItem> getAllOrderItem(){
        return repo.findAll();
    }

    @PatchMapping("/{id}/archive")
    public void archive(@PathVariable Integer id){
        OrderItem order = repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        order.setArchived(true);
        repo.save(order);
    }
}
