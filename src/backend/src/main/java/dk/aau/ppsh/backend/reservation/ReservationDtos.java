package dk.aau.ppsh.backend.reservation; 

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// her står, hvordan data ser ud, når frontend opretter en reservation.
public final class ReservationDtos{ 
    private ReservationDtos(){} 

   // det frontend sender, når  tjenern trykker "Gem reservation"
    public record ReservationRequest(
        @NotBlank(message = "Navn er påkrævet") String customerName,
        String customerPhone,
        @NotNull(message = "Dato er påkrævet") LocalDate resDate,
        @NotNull(message = "Tidspunkt er påkrævet") LocalTime resTime,
        @NotNull @Min(value = 1, message = "Der skal være mindst én gæst") Integer numberOfGuests,
        String specialRequest) {}
}
    


