package dk.aau.ppsh.backend.menu;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ReservationTableId implements Serializable {

    @Column(name="reservation_id")
    private Integer reservationId;

    @Column(name="table_number")
    private Integer tableNumber;
    

public Integer getReservationId() {return reservationId;}
public Integer getTableNumber() {return tableNumber;}


@Override 
public boolean equals(Object o) {

if (this == o) return true;
if (!(o instanceof ReservationTableId other)) return false;
return Objects.equals(reservationId, other.reservationId)
&& Objects.equals(tableNumber, other.tableNumber);
}

@Override
public int hashCode () {

return Objects.hash(reservationId, tableNumber);

}


}
