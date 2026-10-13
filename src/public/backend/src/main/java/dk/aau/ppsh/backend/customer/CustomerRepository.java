package dk.aau.ppsh.backend.customer;

import org.springframework.data.jpa.repository.JpaRepository;

// Spring generates findAll(), findById(), save(), etc. for us
public interface CustomerRepository extends JpaRepository<Customer, Integer> {}