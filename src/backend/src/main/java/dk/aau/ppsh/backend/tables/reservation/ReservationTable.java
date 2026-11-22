package dk.aau.ppsh.backend.tables.reservation;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

// one row = "this reservation uses this table"
@Entity
@Table(name="reservation_table")
public class ReservationTable {
    


        @EmbeddedId 
        private ReservationTableId id;
    protected ReservationTable() {} 


    // create a link between a reservation and a table 
    public ReservationTable(Integer reservationId, Integer tableNumber) { 
        this.id = new ReservationTableId(reservationId, tableNumber); 
    }
    public ReservationTableId getId() {return id;}


    }
