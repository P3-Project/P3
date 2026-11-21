package dk.aau.ppsh.backend.reservation; 

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull; 


public final class ReservationDtos{ 
    private ReservationDtos(){} 


    public record ReservationRequest (
       @NotBlank(message = "Navn er påkævet") String customerName,
       String customerPhone, 
       @NotNull (message = "Dato er påkævet") LocalDate resDate, 
       @NotNull (message = "Tidspunkt er påkævet") LocalTime resTime, 
       @NotNull @Min(value = 1,message ="Der skal være en mindst en gæst") Interger numberOfGuest, 
       String specialRequest, 
       @NotEmpty(message = "vælg mindst et bord") list<Integer> tableNumber){} 
    
  
   public record ReservationReponse( 
    Integer reservationId, 
    String customerName,
    String customerPhone,
    Localdate resDate, 
    LocalTime resTime, 
    Integer duration, 
    Integer numberOfguest, 
    String SpecialRequest, 
    String status 
    list<Integer> tableNumbers) {}
}

