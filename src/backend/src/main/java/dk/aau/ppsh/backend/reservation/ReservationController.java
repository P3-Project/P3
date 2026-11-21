package dk.aau.ppsh.backend.reservation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import dk.aau.ppsh.backend.reservation.ReservationDtos.ReservationRequest;
import dk.aau.ppsh.backend.tables.RestaurantTableRepository;
import dk.aau.ppsh.backend.tables.reservation.ReservationTable;
import dk.aau.ppsh.backend.tables.reservation.ReservationTableRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {


    private final ReservationRepository repo; 
    private final ReservationTableRepository  reservationTables; // hvilke borde en reservation bruger
    private final RestaurantTableRepository  tables; 

    public ReservationController(ReservationRepository repo, ReservationTableRepository reservationTables, RestaurantTableRepository tables) 
    { this.repo = repo; 
    this.reservationTables = reservationTables; 
    this.tables = tables; 
    
    }

    // GET /api/reservations             -> all reservations
    // GET /api/reservations?date=2026-10-12 -> that day's, sorted by time
    @GetMapping
    public List<Reservation> all(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            return repo.findAll();
        }
        return repo.findByResDateOrderByResTime(date);
    }
        // POST /api/reservations -> create a reservation
       @PostMapping
       @Transactional // enten bliver alt gemt eller også bliver intet gemt
    public Reservation create(@Valid @RequestBody Reservation reservation) {
        
        // lav en ny liste og tag hvert bordnummer med en gang 
        
    List<Integer> tableNumbers = new ArrayList<>(); 
    for(Integer number : req.tableNumbers()){ 
        if (!tableNumbers.contains(number)) { 
            tableNumbers.add(number);
        }
    }
    if (tables.findAllById(tableNumbers).size() !=tableNumbers.size()) { 
        throw new ResponseStatusException (HttpStatus.BAD_REQUEST, "et eller flere bordnumre findes ikke"); 

    }
    
    Reservation reservation = new Reservation(); 
    reservation.setCustomerName(req.customername()); 
    reservation.setCustomerPhone(req.customerphone()); 
    reservation.setResDate(req.resDate()); 
    reservation.setResTime(req.resTime()); 
    reservation.setDuration(120); 
    reservation.setNumberofGuests(req.numberOfGuests()); 
    reservation.setSpecialRequest(req.specialRequest()); 
    reservation.setStatus("Booked")  
    repo.save(reservation); 


    for (Integer tableNumber : tableNumbers){ 
        reservationTables.save(new ReservationTable(reservation.getReservationId(),tableNumber));
    } 
   


        return reservation;
    }


}