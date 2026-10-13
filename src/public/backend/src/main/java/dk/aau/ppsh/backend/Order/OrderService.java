package dk.aau.ppsh.backend.order;

import dk.aau.ppsh.backend.menu.MenuItem;
import dk.aau.ppsh.backend.menu.MenuItemRepository;
import dk.aau.ppsh.backend.tables.RestaurantTable;
import dk.aau.ppsh.backend.tables.RestaurantTableRepository;
import dk.aau.ppsh.backend.order.OrderDtos.*;
import dk.aau.ppsh.backend.staff.Staff;
import dk.aau.ppsh.backend.staff.StaffRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Set;

// All the rules about orders live here, the controllers only translate HTTP.
@Service
@Transactional 
public class OrderService {
    private static final Set<String> CAN_TAKE_ORDERS = Set.of("WAITER", "MANAGER");

    private final RestaurantOrderRepository orders;
    private final OrderItemRepository orderItems;
    private final RestaurantTableRepository tables;
    private final StaffRepository staff;
    private final MenuItemRepository menu;

    public OrderService(RestaurantOrderRepository orders, OrderItemRepository orderItems,
                        RestaurantTableRepository tables, StaffRepository staff, MenuItemRepository menu) {
        this.orders = orders;
        this.orderItems = orderItems;
        this.tables = tables;
        this.staff = staff;
        this.menu = menu;
    }

    // ---------- Reading ----------

    @Transactional(readOnly = true)
    public List<OrderDto> list(boolean openOnly) {
        List<RestaurantOrder> found = openOnly
            ? orders.findByClosedAtIsNullAndCancelledAtIsNullOrderByCreatedAtAsc()
            : orders.findAllByOrderByCreatedAtDesc();
        return found.stream().map(OrderService::toDto).toList();
    }

    @Transactional(readOnly = true)
    public OrderDto get(Integer orderId) {
        return toDto(find(orderId));
    }

    @Transactional(readOnly = true)
    public List<KitchenItemDto> kitchenQueue() {
        return orderItems.findPendingForKitchen().stream().map(oi -> new KitchenItemDto(
            oi.getOrderItemId(),
            oi.getRestaurantOrder().getOrderId(),
            oi.getRestaurantOrder().getRestaurantTable().getTableNumber(),
            oi.getMenuItem().getName(),
            oi.getMenuItem().getStation(),
            oi.getQuantity(),
            oi.getNote(),
            oi.getSentAt())).toList();
    }

    // ---------- Waiter actions ----------

    public OrderDto create(CreateOrderRequest req) {
        RestaurantTable table = tables.findById(req.tableNumber())
            .orElseThrow(() -> notFound("Bordet findes ikke"));
        Staff waiter = staff.findById(req.waiterId())
            .orElseThrow(() -> notFound("Medarbejderen findes ikke"));

        if (!Boolean.TRUE.equals(waiter.getActive()) || !CAN_TAKE_ORDERS.contains(waiter.getRole())) {
            throw conflict("Kun aktive tjenere og ledere kan tage imod ordrer");
        }
        if (orders.findByRestaurantTableTableNumberAndClosedAtIsNullAndCancelledAtIsNull(table.getTableNumber()).isPresent()) {
            throw conflict("Bord " + table.getTableNumber() + " har allerede en åben ordre");
        }
        return toDto(orders.save(new RestaurantOrder(table, waiter)));
    }

    public OrderDto addItem(Integer orderId, AddItemRequest req) {
        RestaurantOrder order = findOpen(orderId);
        MenuItem dish = menu.findById(req.itemId()).orElseThrow(() -> notFound("Retten findes ikke"));
        if (Boolean.TRUE.equals(dish.getOutOfStock())) {
            throw conflict(dish.getName() + " er udsolgt");
        }
        String note = cleanNote(req.note());

        // Same dish with the same note that has not been sent yet: just raise the quantity
        OrderItem existing = order.getItems().stream()
            .filter(i -> !i.isSent()
                && i.getMenuItem().getItemId().equals(dish.getItemId())
                && Objects.equals(i.getNote(), note))
            .findFirst().orElse(null);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + req.quantity());
        } else {
            order.getItems().add(new OrderItem(order, dish, req.quantity(), note));
        }
        orders.flush(); // so the new item has its id when we return it
        return toDto(order);
    }

    public OrderDto updateItem(Integer orderId, Integer orderItemId, UpdateItemRequest req) {
        RestaurantOrder order = findOpen(orderId);
        OrderItem item = findItem(order, orderItemId);
        requireNotSent(item);
        item.setQuantity(req.quantity());
        item.setNote(cleanNote(req.note()));
        return toDto(order);
    }

    public OrderDto removeItem(Integer orderId, Integer orderItemId) {
        RestaurantOrder order = findOpen(orderId);
        OrderItem item = findItem(order, orderItemId);
        requireNotSent(item);
        order.getItems().remove(item); // orphanRemoval deletes the row
        return toDto(order);
    }

    // Sends every item that has not been sent yet to the kitchen
    public OrderDto send(Integer orderId) {
        RestaurantOrder order = findOpen(orderId);
        List<OrderItem> unsent = order.getItems().stream().filter(i -> !i.isSent()).toList();
        if (unsent.isEmpty()) throw conflict("Der er intet nyt at sende til køkkenet");
        unsent.forEach(item -> item.markSent());
        return toDto(order);
    }

    public OrderDto close(Integer orderId) {
        RestaurantOrder order = findOpen(orderId);
        if (order.getItems().stream().anyMatch(i -> !i.isSent())) {
            throw conflict("Send eller fjern de usendte retter før ordren lukkes");
        }
        order.close();
        return toDto(order);
    }

    public OrderDto cancel(Integer orderId) {
        RestaurantOrder order = findOpen(orderId);
        order.cancel();
        return toDto(order);
    }

    // ---------- Kitchen action ----------

    public void completeItem(Integer orderItemId) {
        OrderItem item = orderItems.findById(orderItemId).orElseThrow(() -> notFound("Retten findes ikke på ordren"));
        if (!item.isSent()) throw conflict("Retten er ikke sendt til køkkenet endnu");
        if (!item.getRestaurantOrder().isOpen()) throw conflict("Ordren er lukket eller annulleret");
        item.markCompleted();
    }

    // ---------- Helpers ----------

    private RestaurantOrder find(Integer orderId) {
        return orders.findById(orderId).orElseThrow(() -> notFound("Ordren findes ikke"));
    }

    private RestaurantOrder findOpen(Integer orderId) {
        RestaurantOrder order = find(orderId);
        if (!order.isOpen()) throw conflict("Ordren er allerede lukket eller annulleret");
        return order;
    }

    private static OrderItem findItem(RestaurantOrder order, Integer orderItemId) {
        return order.getItems().stream()
            .filter(i -> i.getOrderItemId().equals(orderItemId))
            .findFirst()
            .orElseThrow(() -> notFound("Retten findes ikke på ordren"));
    }

    private static void requireNotSent(OrderItem item) {
        if (item.isSent()) throw conflict("Retten er allerede sendt til køkkenet");
    }

    private static String cleanNote(String note) {
        return (note == null || note.isBlank()) ? null : note.trim();
    }

    private static ResponseStatusException notFound(String msg) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, msg);
    }

    private static ResponseStatusException conflict(String msg) {
        return new ResponseStatusException(HttpStatus.CONFLICT, msg);
    }

    static OrderDto toDto(RestaurantOrder o) {
        List<OrderItemDto> items = o.getItems().stream().map(i -> new OrderItemDto(
            i.getOrderItemId(),
            i.getMenuItem().getItemId(),
            i.getMenuItem().getName(),
            i.getMenuItem().getPrice(),
            i.getQuantity(),
            i.getNote(),
            i.getSentAt(),
            i.isCompleted())).toList();
        int total = items.stream().mapToInt(i -> (i.price() == null ? 0 : i.price()) * i.quantity()).sum();
        return new OrderDto(o.getOrderId(), o.getRestaurantTable().getTableNumber(),
            o.getWaiter().getStaffId(), o.getWaiter().getName(), o.getStatus(),
            o.getCreatedAt(), o.getClosedAt(), o.getCancelledAt(), total, items);
    }
}
