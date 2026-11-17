import { Link, NavLink, Outlet, useMatches, useNavigate } from "react-router";
import { ChevronDown } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Page = { to: string; label: string; end?: boolean };

// The staff sections. Listed by hand so `sections` below can use a fixed type.
type SectionName = "Tjener" | "Køkken" | "Reservation" | "Admin";

// One place for every staff section and its pages.
// Left side of the header = pages of the current section.
// Right side = all sections (dropdown if a section has more than one page).
// The type annotation (instead of `satisfies`) makes every page a `Page`,
// so `page.end` is allowed everywhere, even on pages that don't set it.
const sections: Record<SectionName, { base: string; pages: Page[] }> = {
    Tjener: {
        base: "/waiter",
        pages: [
            { to: "/waiter", label: "Borde Oversigt", end: true },
            { to: "/waiter/history", label: "Ordre Historik" },
            { to: "/waiter/reservations", label: "Reservationer" },
        ],
    },
    Køkken: {
        base: "/kitchen",
        pages: [
            { to: "/kitchen/overview", label: "Køkken Oversigt" },
            { to: "/kitchen/pizza", label: "Pizza Køkken" },
            { to: "/kitchen/grill", label: "Grill Køkken" },
        ],
    },
    Reservation: {
        base: "/reservation",
        pages: [{ to: "/reservation", label: "Reservationer", end: true }],
    },
    Admin: {
        base: "/admin",
        pages: [
            { to: "/admin", label: "Reservationer", end: true },
            { to: "/admin/menu", label: "Menukort" },
        ],
    },
};

// Order of the sections on the right. Add "Admin" when its route exists again.
const sectionOrder: SectionName[] = ["Tjener", "Køkken", "Reservation"];

type RouteHandle = { fullBleed?: boolean } | undefined;

// Shared look for every header link/button. h-11 = 44px, easy to tap on an iPad.
const navItem = (active: boolean) =>
    `flex h-11 items-center gap-1 rounded-lg px-4 text-sm ${active
        ? "bg-background font-medium shadow-sm"
        : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
    }`;

export function StaffLayout({ title }: { title: SectionName }) {
    const fullBleed = useMatches().some((match) => (match.handle as RouteHandle)?.fullBleed);
    const navigate = useNavigate();

    return (
        <div className="flex h-svh flex-col">
            <header className="shrink-0 border-b bg-muted/40">
                <nav className="flex items-center gap-2 px-4 py-2">
                    {/* The title doubles as a "home" link for the current section, e.g. /waiter -> table grid */}
                    <Link
                        to={sections[title].base}
                        className="mr-4 flex h-11 items-center rounded-lg px-2 font-semibold hover:bg-background/60"
                    >
                        PPSH · {title}
                    </Link>

                    {/* Left: pages inside the current section */}
                    {sections[title].pages.map((page) => (
                        <NavLink
                            key={page.to}
                            to={page.to}
                            end={page.end}
                            className={({ isActive }) => navItem(isActive)}
                        >
                            {page.label}
                        </NavLink>
                    ))}

                    {/* Right: all staff sections, always visible. ml-auto pushes them right. */}
                    <div className="ml-auto flex items-center gap-2 border-l pl-4">
                        {sectionOrder.map((name) => {
                            const section = sections[name];
                            const isCurrent = name === title;

                            // One page → a plain link
                            if (section.pages.length === 1) {
                                return (
                                    <NavLink key={name} to={section.base} className={navItem(isCurrent)}>
                                        {name}
                                    </NavLink>
                                );
                            }

                            // Several pages → a dropdown listing them
                            return (
                                <DropdownMenu key={name}>
                                    <DropdownMenuTrigger className={navItem(isCurrent)}>
                                        {name}
                                        <ChevronDown className="size-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {section.pages.map((page) => (
                                            <DropdownMenuItem
                                                key={page.to}
                                                className="h-11" // keep tap targets iPad-sized
                                                onClick={() => navigate(page.to)}
                                            >
                                                {page.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            );
                        })}
                    </div>
                </nav>
            </header>
            <main className="min-h-0 flex-1 overflow-y-auto">
                {fullBleed ? <Outlet /> : <div className="p-6"><Outlet /></div>}
            </main>
        </div>
    );
}