package dk.aau.ppsh.backend.tools;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import tools.jackson.databind.ObjectMapper; // Jackson 3, included with Spring Boot 4

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// One-off tool: scrapes pandruppizza.dk/menu into data/menu.json. Run it by hand, not part of the API.
public class MenuScraper{
    // One dish in the JSON file
    record ScrapedDish(
        String category,
        String number,
        String name,
        String description,
        Integer price,
        String priceText,
        boolean lunchOffer,
        boolean charcoalGrill
    ) {}

    // Categories with a different layout: add these by hand instead
    private static final Set<String> SKIP = Set.of("Frokosttilbud", "Tilbehør", "Drikkevarer");

    // "2A. PEPPERONI med ..." -> group 1 = "2A," group 2 = "PEPPERONI med ..."
    private static final Pattern NUMBERED = Pattern.compile("^(\\d+[A-Z]?)\\.\\s*(.+)$");

    // First number in the price, e.g. "103,-" -> 103
    private static final Pattern PRICE = Pattern.compile("(\\d+)");

    public static void main(String[] args) throws Exception {
        Document page = Jsoup.connect("https://pandruppizza.dk/menu/").userAgent("Mozilla/5.0 (AAU Student Project)").get(); // Some sites block requests wihtout a user Agent.

        List<ScrapedDish> dishes = new ArrayList<>();
        String category = null;

        // Walk through every h4 and table IN PAGE ORDER.
        // An h3 sets the current category, and a table's rows belong to the last h3 we saw.
        for (Element el : page.select("h3, table")){
            if(el.tagName().equals("h3")){
                category = el.text().trim();
                continue;
            }
            if(category == null || SKIP.contains(category)) continue;

            for (Element row : el.select("tr")){
                Elements cells = row.select("td");
                if (cells.size() < 2) continue;

                String priceText = cells.last().text().trim();
                if(priceText.isEmpty()) continue; // Bold note rows have no price
                
                String text = cells.get(cells.size() - 2).text().trim();

                // Only the Pizza table has 3 columns; the first golds the lunch staricon
                boolean lunchOffer = cells.size() >= 3 && !cells.first().children().isEmpty();

                // Pull out the "Kul-Grill" marker so it isn't part of the description
                boolean charcoalGrill = text.contains("Kul-Grill");
                text = text.replace("Kul-Grill", "").trim();

                // Split off the dish number if there is one
                String number = null;
                Matcher m = NUMBERED.matcher(text);
                if(m.matches()){
                    number = m.group(1);
                    text = m.group(2);
                }

                String[] nameAndDesc = splitNameAndDescription(text);

                Matcher p = PRICE.matcher(priceText);
                Integer price = p.find() ? Integer.parseInt(p.group(1)) : null;

                dishes.add(new ScrapedDish(category, number, nameAndDesc[0], nameAndDesc[1], price, priceText, lunchOffer, charcoalGrill));
            }
        }

        // Save as pretty-printed JSON 
        new File("data").mkdirs();
        new ObjectMapper().writerWithDefaultPrettyPrinter().writeValue(new File("data/menu.json"), dishes);

        System.out.println("Saved " + dishes.size() + " dishes to data/menu.json");
    }

    // Names are written in CAPITALS and descriptions start with a lowercase word ("med", "kebab" ...)
    // or a dash ("- ca. 200g"). So the name is every word up to the first such word.
    private static String[] splitNameAndDescription(String text){
        String[] words = text.split("\\s+");
        int i = 0;
        while (i < words.length && !startsDescription(words[i])) i++;

        String name = String.join(" ", java.util.Arrays.copyOfRange(words, 0, i));
        String description = String.join (" ", java.util.Arrays.copyOfRange(words, i, words.length));
        return new String[] {name, description};
    }

    private static boolean startsDescription(String word){
        char c = word.charAt(0);
        return Character.isLowerCase(c) || c == '-'; // Works for ø, æ, å too
    }
}

// Printed:
// Saved 189 dishes to data/menu.json