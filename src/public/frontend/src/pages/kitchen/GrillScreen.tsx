import { KitchenBoard } from "@/features/kitchen/KitchenBoard";

// Only dishes made at the grill station
export default function GrillScreen() {
  return <KitchenBoard station="GRILL" />;
}