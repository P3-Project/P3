package dk.aau.ppsh.backend.order;

import dk.aau.ppsh.backend.menu.MenuItemRepository;
import dk.aau.ppsh.backend.order.OrderDtos.AddItemRequest;
import dk.aau.ppsh.backend.order.OrderDtos.CreateOrderRequest;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
@Order(2)
public class TestOrderSeeder implements CommandLineRunner{
    private static final int WAITER_ID = 2; // Mads Nielsen (S002) from R__test_data

    // One line on a test order: which dish (by menu number), how many, and an optional note
    private record Line(String dishNumber, int quantity, String note) {}

    private final OrderService orderService;
    private final RestaurantOrderRepository orders;
    private final MenuItemRepository menu;

    public TestOrderSeeder(OrderService orderService, RestaurantOrderRepository orders, MenuItemRepository menu) {
        this.orderService = orderService;
        this.orders = orders;
        this.menu = menu;
    }

    @Override
    public void run(String... args) {
        if (orders.count() > 0) return; // only seed an empty database

        seed(1, List.of(new Line("87", 2, null),                  // Dansk bøf
                        new Line("70", 1, "uden løg")), true);    // Dobbeltburger
        seed(3, List.of(new Line("1", 2, null),                   // Margherita
                        new Line("94", 1, "medium rare")), true); // Pebersteak
        seed(4, List.of(new Line("93", 1, "well done"),           // T-bone steak
                        new Line("78", 2, "ekstra stærk")), true);// Adana kebab
        seed(5, List.of(new Line("2A", 1, "uden oregano")), true);// Pepperoni
        seed(7, List.of(new Line("4", 2, "ekstra ananas")), true);// Hawaii, sent
        seed(7, List.of(new Line("5", 1, null)), false);          // Vesuvio, NOT sent yet (stays with the waiter)

        System.out.println("TestOrderSeeder: created test orders");
    }

    // Opens the table's order (or reuses it), adds the lines, and optionally sends them to the kitchen
    private void seed(int tableNumber, List<Line> lines, boolean sendToKitchen) {
        Integer orderId = orders.findByRestaurantTableTableNumberAndClosedAtIsNullAndCancelledAtIsNull(tableNumber)
            .map(RestaurantOrder::getOrderId)
            .orElseGet(() -> orderService.create(new CreateOrderRequest(tableNumber, WAITER_ID)).orderId());

        for (Line line : lines) {
            menu.findByDishNumber(line.dishNumber()).ifPresentOrElse(
                dish -> orderService.addItem(orderId, new AddItemRequest(dish.getItemId(), line.quantity(), line.note())),
                () -> System.out.println("TestOrderSeeder: no dish with number " + line.dishNumber()));
        }
        if (sendToKitchen) orderService.send(orderId);
    }
}
