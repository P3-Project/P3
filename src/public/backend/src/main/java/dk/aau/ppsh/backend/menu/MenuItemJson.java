package dk.aau.ppsh.backend.menu;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


@JsonIgnoreProperties(ignoreUnknown = true)
public record MenuItemJson(
        String name,
        String number,
        Integer price,
        String description,
        String category,
        Boolean charcoalGrill // true for dishes made on the charcoal grill
) {}