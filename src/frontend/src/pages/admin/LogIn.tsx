import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Staff = {
    staffId: number;
    staffNumber: string;
    name: string;
    role: "MANAGER" | "WAITER" | "KITCHEN";
    active: boolean;
}

const startPage: Record<Staff["role"], string> = {
    WAITER: "/waiter",
    KITCHEN: "/kitchen",
    MANAGER: "/admin",
};

export default function LogInPage() {
    const navigate = useNavigate();

    // The staff list, so we can see who the typed number belongs to
    const staffList = useQuery({
        queryKey: ["staff"],
        queryFn: async (): Promise<Staff[]> => {
            const res = await fetch("/api/staff");
            if(!res.ok) throw new Error("Kunne ikke hente medarbejder");
            return res.json();
        },
    });

    const [staffNumber, setStaffNumber] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    // Who is this? Recalculated on every keystroke: "s002" and "S002" both match.
    const typed = staffNumber.trim().toUpperCase();
    const staff = staffList.data?.find((s) => s.staffNumber.toUpperCase() === typed);

    // Only the owner/admin needs a password. The field appears as soon as their number
    const needsPassword = staff?.role === "MANAGER";

    function handleSubmit(e: React.SubmitEvent){
        e.preventDefault();
        setError(null);
        setMessage(null);

        if(!typed) return setError("Skriv dit medarbejdernummer");
        if(!staff || !staff.active) return setError("Ukendt medarbejdernummer");

        if(needsPassword){
            if(!password) return setError("Skriv din adgangskode");
            // TODO: POST /api/auth/login { staffNumber, password } and only navigate if the backend says OK.
            // The password can't be checked here in the browser: it would be visible to anyone
            setMessage(`Hej ${staff.name}. Admin-login er ikke koblet til backenden endnu.`);
            return;
        }

        // Waiter / kitchen: staff number is enough -> straight to their screen
        navigate(startPage[staff.role]);
    }

return (
    // Centred on the page, narrow like a typical login box
    <section className="mx-auto max-w-sm pt-6 md:pt-12">
      <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
        <h1 className="font-heading text-3xl font-medium tracking-tight">Medarbejder-login</h1>
        <p className="mt-2 text-muted-foreground">Skriv dit medarbejdernummer.</p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div className="grid gap-1.5">
            <label htmlFor="staffNumber" className="text-sm font-medium">
              Medarbejdernummer
            </label>
            <Input
              id="staffNumber"
              value={staffNumber}
              onChange={(e) => {
                setStaffNumber(e.target.value);
                setError(null); // old error disappears as soon as they type again
              }}
              placeholder=""
              autoComplete="username" // lets the browser/iPad remember it
              autoCapitalize="characters"
              autoFocus
              className="h-12 text-lg tracking-wider"
            />
            {/* Small greeting once the number is recognised, so staff know they typed it right */}
            {/*{staff?.active && <p className="text-sm text-muted-foreground">Hej {staff.name}</p>}*/}
          </div>

          {/* Only rendered for the admin */}
          {needsPassword && (
            <div className="grid gap-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Adgangskode
              </label>
              {/* relative: the eye button is positioned inside the input */}
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="current-password"
                  className="h-12 pr-11"
                />
                <button
                  type="button" // so clicking it doesn't submit the form
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Skjul adgangskode" : "Vis adgangskode"}
                  className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="h-12 w-full text-base" disabled={staffList.isPending}>
            <LogIn />
            Log ind
          </Button>

          {staffList.isError && (
            <p role="alert" className="text-sm text-destructive">
              Kan ikke nå serveren. Prøv igen om lidt.
            </p>
          )}

          {/* role="status": screen readers read the message out when it appears */}
          {message && (
            <p role="status" className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              {message}
            </p>
          )}
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Kender du ikke dit nummer? Spørg ejeren.
      </p>
    </section>
  );
}