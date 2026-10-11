package dk.aau.ppsh.backend.menu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table (name="menu_item")

public class MenuItem {
    
@Id
@GeneratedValue(strategy= GenerationType.IDENTITY)
@Column (name="item_id")
private Integer itemId;
private String name;
private Integer price;
@Column (name="dish_description")
private String dishDescription;
private String station;
@Column (name="out_of_stock")
private Boolean outOfStock;
private String category;
@Column(name="prep_time")
private Integer prepTime;



public Integer getItemId() {return itemId;}
public String getName() {return name;}
public Integer getPrice() {return price;}
public String getDishDescription() {return dishDescription;}
public String getStation() {return station;}
public Boolean getOutOfStock() {return outOfStock;}
public String getCategory() {return category;}
public Integer getPrepTime() {return prepTime;}
}
