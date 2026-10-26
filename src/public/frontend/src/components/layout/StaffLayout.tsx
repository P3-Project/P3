import { NavLink, Outlet } from "react-router";

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
    { to: "/kitchen/overview", label: "Oversigt", end: true},
    { to: "/kitchen/pizza", label: "Pizza" },
    { to: "/kitchen/grill", label: "Grill" },
],
};

export function StaffLayout({ title }: { title: keyof typeof links }) {
    return (
        <div className="flex min-h-svh flex-col">
            <header className="border-b bg-muted/40">
                <nav className="flex items-center gap-6 px-6 py-3">
                    <span className="font-semibold">PPSH · {title}</span>
                    {links[title].map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive })=> `rounded-md px-3 py-2 text-sm text-foreground! no-underline! ${isActive ? "bg-background font-medium shadow-sm" : "hover:bg-background/60"}`
                        }>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                </header>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}