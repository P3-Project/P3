import { KitchenBoard } from "@/features/kitchen/kitchenBoard";

// Only dishes made at the pizza station
export default function PizzaScreen() {
  return <KitchenBoard station="PIZZA" />;
}