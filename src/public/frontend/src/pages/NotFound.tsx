import { Link } from "react-router";

export default function NotFound(){
    return(
        <main className="grid min-h-svh place-content-center gap-3 text-center">
            <h1 className="text-2xl font-semibold">Siden findes ikke</h1>
            <Link to="/" className="underline">
            Til forsiden
            </Link>
        </main>
    );
}