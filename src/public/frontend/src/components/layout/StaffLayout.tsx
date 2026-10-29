import { NavLink, Outlet, useMatches } from "react-router";

const links = {
    Tjener: [
        { to: "/waiter", label: "Borde", end: true },
        { to: "/waiter/reservations", label: "Reservationer" },
    ],
    Admin: [
        { to: "/admin", label: "Reservationer", end: true },
        { to: "/admin/menu", label: "Menukort" },
    ],
    Køkken: [
        { to: "/kitchen/overview", label: "Oversigt", end: true },
        { to: "/kitchen/pizza", label: "Pizza" },
        { to: "/kitchen/grill", label: "Grill" },
    ],
    Reservation: [
        { to: "/kitchen/overview", label: "Oversigt", end: true },
        { to: "/kitchen/pizza", label: "Pizza" },
        { to: "/kitchen/grill", label: "Grill" },
    ],
};

type RouteHandle = { fullBleed?: boolean } | undefined

export function StaffLayout({ title }: { title: keyof typeof links }) {
    const fullBleed = useMatches().some((match) => (match.handle as RouteHandle)?.fullBleed)

    return (

        <div className="flex h-svh flex-col">
            <header className="shrink-0 border-b bg-muted/40">
                <nav className="flex items-center gap-2 px-4 py-2">
                    <span className="mr-4 font-semibold">PPSH · {title}</span>
                    {links[title].map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            // h-11 = 44px: comfortable to tap on an iPad
                            className={({ isActive }) =>
                                `flex h-11 items-center rounded-lg px-4 text-sm ${isActive ? "bg-background font-medium shadow-sm" : "hover:bg-background/60"
                                }`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main className="min-h-0 flex-1 overflow-y-auto">
                {fullBleed ? <Outlet /> : <div className="p-6"><Outlet /></div>}
            </main>
        </div>
    );
}