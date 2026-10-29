import { KitchenBoard } from "@/features/kitchen/KitchenBoard";

// Only dishes made at the pizza station
export default function PizzaScreen() {
  return <KitchenBoard station="PIZZA" />;
}