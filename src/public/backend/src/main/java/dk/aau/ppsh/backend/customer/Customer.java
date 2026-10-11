package dk.aau.ppsh.backend.customer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_phone")
    private String customerPhone;

    public Integer getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getCustomerPhone() { return customerPhone; }
}