package dk.aau.ppsh.backend.menu;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
@Table(name="reservation_table")

public class ReservationTable {
    


        @EmbeddedId 
        private ReservationTableId id;

    public ReservationTableId getId() {return id;}


    }
