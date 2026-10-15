import type { MenuItem, RestaurantTable } from "./types";

// Bordene i restauranten
export const mockTables: RestaurantTable[] = [
  { tableNumber: 1, seats: 2 },
  { tableNumber: 2, seats: 2 },
  { tableNumber: 3, seats: 4 },
  { tableNumber: 4, seats: 4 },
  { tableNumber: 5, seats: 6 },
];

// Nogle retter fra ppsh menu
export const mockMenu: MenuItem[] = [
  { itemId: 1, name: "Margherita", price: 79, dishDescription: "Tomatsauce, 2 x ost og oregano", category: "Pizza", station: "PIZZA", outOfStock: false },
  { itemId: 2, name: "Pepperoni", price: 85, dishDescription: "Tomatsauce, ost, pepperoni og oregano", category: "Pizza", station: "PIZZA", outOfStock: false },
  { itemId: 3, name: "Hawaii", price: 89, dishDescription: "Tomatsauce, ost, skinke, ananas og oregano", category: "Pizza", station: "PIZZA", outOfStock: false },
  { itemId: 4, name: "Bøfsandwich", price: 95, dishDescription: "Ca. 200 g med brun sovs og ristet løg", category: "Grill & steak", station: "KITCHEN", outOfStock: false },
  { itemId: 5, name: "Græsk bøf", price: 129, dishDescription: "4 stk. oksehakkebøffer med champignonsauce", category: "Grill & steak", station: "KITCHEN", outOfStock: false },
  { itemId: 6, name: "Baconburger", price: 69, dishDescription: "Salat, agurk, tomat, rødløg og bacon", category: "Burgere", station: "KITCHEN", outOfStock: false },
  { itemId: 7, name: "Dobbeltburger", price: 80, dishDescription: "Salat, agurk, tomat, rødløg og dressing", category: "Burgere", station: "KITCHEN", outOfStock: true },
];