import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/sols", label: "Sols" },
  { to: "/studio", label: "Studio" },
  { to: "/guide", label: "Guide" },
  { to: "/dashboard", label: "Dashboard" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all",
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg bg-warm shadow-glow grid place-items-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Pixel</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => cn(
                "px-4 py-2 text-sm rounded-full transition-colors",
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >{n.label}</NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Se connecter</Link>
          </Button>
          <Button asChild size="sm" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
            <Link to="/auth">Essayer gratuitement</Link>
          </Button>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => cn(
                "px-4 py-3 rounded-lg text-base",
                isActive ? "bg-secondary" : "hover:bg-secondary/50"
              )}>{n.label}</NavLink>
            ))}
            <Button asChild className="mt-2 rounded-full bg-foreground text-background">
              <Link to="/studio">Essayer gratuitement</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
