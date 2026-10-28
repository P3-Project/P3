import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";

export default function Frontpage() {
    return (
        <section className="space-y-6">
            <h1 className="text-4xl font-semibold">Pandrup Pizza &amp; Steak House</h1>
            <p className="text-muted-foreground">Pizza fra stenovnen og bøf fra trækulsgrillen. Ring og bestil bord.</p>

            <div className="flex gap-3">
                <Link to="/menu" className={`${buttonVariants()} bg-[#586828]! text-white! no-underline! hover:bg-[#4a5a22]!`}>Se Menukort</Link>
                <a href="tel:+4598246566" className={`${buttonVariants({ variant: "outline"})} border-[#586828]! text-[#586828]! no-underline!`}>Ring og bestil bord</a>
            </div>
        </section>
    );
}