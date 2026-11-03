import { KitchenBoard } from "./KitchenBoard";

export default function OverviewScreen() {
        return (
        // Two columns on wide screens, stacked on narrow ones
        <div className="grid gap-8 lg:grid-cols-2">
            <KitchenBoard station="PIZZA" title="PIZZA" />
            <KitchenBoard station="GRILL" title="GRILL" />
        </div>
    );
}