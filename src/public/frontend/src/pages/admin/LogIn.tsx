import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";

export default function LogInPage() {
    return (
        <section className="space-y-6">
            <h1 className="text-4xl font-semibold">Er du medarbejder</h1>
            <p className="text-muted-foreground">Login som medarbejder</p>
        </section>
    );
}