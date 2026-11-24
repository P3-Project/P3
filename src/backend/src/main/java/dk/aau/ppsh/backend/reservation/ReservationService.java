package dk.aau.ppsh.backend.reservation;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import dk.aau.ppsh.backend.reservation.ReservationDtos.ReservationRequest;
import dk.aau.ppsh.backend.tables.RestaurantTable;
import dk.aau.ppsh.backend.tables.RestaurantTableRepository;
import dk.aau.ppsh.backend.tables.reservation.ReservationTableRepository;


/**
 * The following reservation rules are described down below, the controller translates only the HTTP. 
 * According to the class diagram (Figure 7.2), one method  per operation on Reservation,
 * which follows the statechart (Figure 7,4):
 *  booked => seated => completed, booked => cancelled, booked => no_show
 * the status: completed, cancelled and no_show are finals: there is no way back from it.  
 */
@Service
@Transactional

public class ReservationService {
    private static final int DEFAULT_DURATION = 120; // This is for 2 hours


    private final ReservationRepository reservations;
    private final ReservationTableRepository reservationTables;
    private final RestaurantTableRepository tables;


    public ReservationService(ReservationRepository reservations,
            ReservationTableRepository reservationTables, RestaurantTableRepository tables) {
            this.reservations = reservations;
            this.reservationTables = reservationTables;
            this.tables = tables;
            }
    

            // This shows the what list the waiters gets: the table numbers + reservation,
            // so the "bord" column can be filled in. If the list is empty, there is no table yet. 

        public record ReservationDto(Integer reservationId, String customerName, String customerPhone, 
            LocalDate resDate, LocalTime resTime, Integer duration, Integer numberOfGuests, 
            String specialRequest, String status, List<Integer> tables) {}



            // -----------Reading part-----------------

            // upcoming = only the guests are expected or sitting now, so
            // a cancelled, no-show or completed reservations are dropped off the list. 

            @Transactional (readOnly = true)
            public List<ReservationDto> list(LocalDate date, LocalDate from, LocalDate before, boolean upcoming) {
                    List<Reservation> found; 
                    if (date != null && upcoming) {
                        found = reservations.findByResDateAndStatusNotInOrderByResTime(    
                        date, List.of("cancelled", "no_show", "completed"));
                    } else if (date != null) {
                        found = reservations.findByResDateOrderByResTime(date);
                    } else if (from != null) {
                        found = reservations.findByResDateGreaterThanEqualOrderByResDateAscResTimeAsc(from);
                    } else if (before != null) {
                        found = reservations.findByResDateLessThanOrderByResDateDescResTimeDesc(before);
                    } else {
                        found = reservations.findAll();
                    }
            // One small query per reservation for its tables. PPSH has 1-10 reservations a day according to (Appendix B), 
            // so this will not be changed. 
                        return found.stream().map(this::toDto).toList();

            }
                
@Transactional (readOnly = true)
public ReservationDto get(int id) {
    return toDto(find(id));
}




public ReservationDto create(ReservationRequest req) {

       Reservation reservation = new Reservation();
       reservation.setCustomerName(req.customerName());
       reservation.setCustomerPhone(req.customerPhone());
       reservation.setResDate(req.resDate());
       reservation.setResTime(req.resTime());
       reservation.setDuration(DEFAULT_DURATION);
       reservation.setNumberOfGuests(req.numberOfGuests());
       reservation.setSpecialRequest(req.specialRequest());
       reservation.setStatus("booked");
       return toDto(reservations.save(reservation));
}

// change(): only while it is booked. The duration stays the same, as it was. 

public ReservationDto change(int id, ReservationRequest req) {

Reservation current = find(id);
int changed = reservations.updateBooked(id, req.customerName(), req.customerPhone(), req.resDate(), req.resTime(), current.getDuration(), req.numberOfGuests(), req.specialRequest());

if (changed == 0) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, 
        "Kun bookede reservationer kan rettes (status er " + current.getStatus() + ")");

}
return get(id);

}          



// assignTable(): booked => booked. Several tables for a large group according to (M.8).

// The waiter or the guests chooses the tables according to (Appendix B); the code below checks the choices.

public ReservationDto assignTables(int id, List<Integer> tableNumbers) {

Reservation r = find(id);
if (!"booked".equals(r.getStatus())) {
    throw new ResponseStatusException(HttpStatus.CONFLICT,
             "Kun bookede reservationer kan få et bord (status er " + r.getStatus() + ")");
}
if (tableNumbers == null || tableNumbers.isEmpty()) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vælg mindt ét bord");
}
// guests = 1, because the seats are checked for all the chosen tables together  below
List<RestaurantTable> free = tables.findAvailableTables(
        r.getResDate(), r.getResTime(), r.getDuration(), 1, id);


        int seats = 0;
        for (Integer number : tableNumbers) {
            RestaurantTable table = free.stream()
                .filter(t -> t.getTableNumber().equals(number))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                                "Bord " + number + " er optaget eller findes ikke"));
            seats += table.getSeats();
        }
        if (seats < r.getNumberOfGuests()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Bordene har " + seats + " pladser, men der er " + r.getNumberOfGuests() + " gæster");
        }

        for (Integer number : tableNumbers) {
            if (reservationTables.addTable(id, number) == 0) {// taken a moment ago
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Bord " + number + " er optaget");

            }
        }
        return get(id);
    }
            
            
// markedArrived(): booked => seated, can only be done when the reservation has a table.
public ReservationDto markArrived(int id) {
        if(reservations.markSeated(id) == 0) {
            Reservation r = find(id);
            String message = "booked".equals(r.getStatus())
                ? "Tildel et bord, før gæsterne markeres som ankommet"
                : "Reservationen er " + r.getStatus() + ", ikke booked";
        throw new ResponseStatusException(HttpStatus.CONFLICT, message);
        }
        return get(id);
    }       
            
     // markLeft(): seated => completed down below.
     
     public ReservationDto markLeft(int id) {
            return move(id, "seated", "completed");

     }

     // markNoShow(): booked -> no_show. Waiter or manager removes a reservation when the
     // guests are more than 30 seconds late according to (Appendix B)
     public ReservationDto markNoShow(int id) {
        return move(id, "booked", "no_show");
     }


     // cancel(): booked => cancelled. The row is kept, so the history will not be lost. 
     public ReservationDto cancel(int id) {
            return move(id, "booked", "cancelled");
     }

     // -------Helps---------

     private ReservationDto move(int id, String from, String to) {
        if (reservations.changeStatus(id, from, to) == 0) {
                    Reservation r = find(id);
        throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Reservationen er " + r.getStatus() + ", den skal være " + from);
    
        }
        return get(id);

     }

     private Reservation find(int id) {
            return reservations.findById(id).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Reservation " + id + " findes ikke"));

     }

     private ReservationDto toDto(Reservation r) {
            return new ReservationDto(r.getReservationId(), r.getCustomerName(), r.getCustomerPhone(), r.getResDate(), r.getResTime(), r.getDuration(), r.getNumberOfGuests(),
        r.getSpecialRequest(), r.getStatus(), reservationTables.findTableNumbers(r.getReservationId()));

     }
}
