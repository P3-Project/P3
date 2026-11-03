import { NavLink, Outlet } from "react-router";

export function CustomerLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      {/* sticky + slightly see-through background with blur: the header stays while scrolling */}
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          {/* On phones only "Pandrup Pizza" fits next to the nav, so the rest is hidden below the sm breakpoint */}
          <NavLink to="/" className="font-heading text-lg font-medium whitespace-nowrap">
            Pandrup Pizza<span className="hidden sm:inline"> &amp; Steak House</span>
          </NavLink>
          <div className="flex items-center gap-1 text-sm">
            <NavItem to="/" end>
              Forside
            </NavItem>
            <NavItem to="/menu">Menukort</NavItem>
            <NavItem to="/login">Login</NavItem>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 md:py-14">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-6 text-sm text-muted-foreground md:px-6">
          <span>Pandrup Pizza &amp; Steak House</span>
          <a href="tel:+4598246566" className="hover:text-foreground">
            Tlf. 98 24 65 66
          </a>
        </div>
      </footer>
    </div>
  );
}

// NavLink knows if its route is active, so the current page gets highlighted
function NavItem({ to, end, children }: { to: string; end?: boolean; children: string }) {
  return (
    <NavLink
      to={to}
      end={end} // "end" = only active on exactly "/", not on every child route
      // Pill-shaped highlight instead of an underline; h-9 gives a decent tap area on phones
      className={({ isActive }) =>
        `flex h-9 items-center rounded-full px-3 transition ${
          isActive ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:text-foreground"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
