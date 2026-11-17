package dk.aau.ppsh.backend.customer;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerRepository repo;

    public CustomerController(CustomerRepository repo) { this.repo = repo; } // Injected by Spring

    @GetMapping
    public List<Customer> all(){
        return repo.findAll(); // Returned as JSON automatically
    }
}