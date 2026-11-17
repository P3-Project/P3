import { KitchenBoard } from "@/features/kitchen/kitchenBoard";

// Only dishes made at the grill station
export default function GrillScreen() {
  return <KitchenBoard station="GRILL" />;
}