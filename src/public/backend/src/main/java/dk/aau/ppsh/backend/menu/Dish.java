package dk.aau.ppsh.backend.menu;

import jakarta.persistence.*;
import java.math.BigDecimal;

// Maps to the 'dish' table created in V1
@Entity
public class Dish{
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) // SERIAL in Postgres
    private Integer id; // Integer, not Long: SERIAL is a 4-byte int

    private String name;
    private String ingredients;
    private BigDecimal price; // BigDecimal for money, never double

    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getIngredients() { return ingredients; }
    public BigDecimal getPrice() { return price; }
}