package dk.aau.ppsh.backend.order;

import java.util.List;

public class KitchenDtos {
    // One line on a kitchen ticket
    record KitchenItemDto(Integer id, String name, Integer quantity, String note){}

    // One ticket: an order at a table, with its unfinished items
    record KitchenOrderDto(Integer id, Integer tableNumber, List<KitchenItemDto> items){}
}
