// Hvor en ret skal sendes hen.
export type Station = "PIZZA" | "KITCHEN";
// Én ret på menuen
export type MenuItem = {
  itemId: number;
  name: string;
  price: number;
  dishDescription: string;
  category: string;     // fx "Pizza" eller "Burgere"
  station: Station;
  outOfStock: boolean;  // true = varen er der ikke
};

export type RestaurantTable = {
  tableNumber: number;
  seats: number;
};

// Én linje på en ordre, fx "2 × Margherita, uden løg"
export type OrderLine = {
  lineId: number;
  item: MenuItem;           
  quantity: number;
  note: string;
  sentAt: string | null;    // null = ikke sendt til køkkenet endnu
};