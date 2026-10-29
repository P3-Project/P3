package dk.aau.ppsh.backend.menu;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties(ignoreUnknown = true)
public record MenuItemJson(
        String number,
        String name,
        Integer price,
        String description,
        String category,
        Boolean charcoalGrill // true for dishes made on the charcoal grill
) {}