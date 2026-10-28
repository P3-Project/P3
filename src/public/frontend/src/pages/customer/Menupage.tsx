import { MenuList } from "@/features/menu/components/MenuList";

// Thin page: a calm intro, then the menu feature does the rest.
export default function MenuPage() {
  return (
    <>
      <header className="mb-10 md:mb-14">
        {/* font-heading = Fraunces (set in index.css @theme) */}
        <h1 className="font-heading text-4xl font-medium tracking-tight md:text-5xl">Menukort</h1>
        <p className="mt-2 text-muted-foreground">Bestil på telefon eller spis hos os i Pandrup.</p>
      </header>
      <MenuList />
    </>
  );
}
