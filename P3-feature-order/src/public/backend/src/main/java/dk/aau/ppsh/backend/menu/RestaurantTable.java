package dk.aau.ppsh.backend.menu;

import jakarta.persistence.*;


// Maps to the 'resturant_table' table created in V1
@Entity
@Table(name="restaurant_table") // class name != table name, so we say it explicitly
public class RestaurantTable{
    @Id // NO @GeneratedValue: the restaurant picks the numbers
    @Column(name="table_number") // Java uses camelCase, SQL uses snake_case
    private Integer tableNumber;
    private Integer seats; // column name is the same, so no @Column needed

    public Integer getTableNumber() {return tableNumber;}
    public Integer getSeats() {return seats;}
}