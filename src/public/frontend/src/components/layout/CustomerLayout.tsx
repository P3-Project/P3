import { NavLink, Outlet } from "react-router";

export function CustomerLayout() {
    return (
        <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="font-semibold">
            Pandrup Pizza &amp; Steak House
          </NavLink>
          <div className="flex gap-4 text-sm">
            <NavItem to="/" end>
              Forside
            </NavItem>
            <NavItem to="/menu">Menukort</NavItem>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

// NavLink knows if its route is active, so we can underline the current page
function NavItem({ to, end, children }: { to: string; end?: boolean; children: string }) {
  return (
    <NavLink
      to={to}
      end={end} // "end" = only active on exactly "/", not on every child route
      className={({ isActive }) => (isActive ? "font-medium underline underline-offset-4" : "")}
    >
      {children}
    </NavLink>
  );
}