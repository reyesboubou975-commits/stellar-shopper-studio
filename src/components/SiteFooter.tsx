import { Link } from "react-router-dom";
import { Sparkles, Instagram, Twitter, Github } from "lucide-react";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-24">
    <div className="container py-16 grid gap-12 md:grid-cols-4">
      <div className="md:col-span-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-warm grid place-items-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-semibold">Pixel</span>
        </Link>
        <p className="mt-4 text-muted-foreground max-w-sm">
          Le studio photo IA pensé pour les vendeurs Vinted. Photos pro, en 8 secondes,
          sur sols réels — pas de fake, pas de sable réfléchissant.
        </p>
        <div className="mt-6 flex gap-3 text-muted-foreground">
          <a href="#" aria-label="Instagram" className="hover:text-foreground transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href="#" aria-label="Twitter" className="hover:text-foreground transition-colors"><Twitter className="w-5 h-5" /></a>
          <a href="#" aria-label="Github" className="hover:text-foreground transition-colors"><Github className="w-5 h-5" /></a>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-4">Produit</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/studio" className="hover:text-foreground">Studio</Link></li>
          <li><Link to="/sols" className="hover:text-foreground">Catalogue de sols</Link></li>
          <li><Link to="/guide" className="hover:text-foreground">Guide Vinted</Link></li>
          <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-4">Pixel</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Mentions légales</li>
          <li>Confidentialité</li>
          <li>Contact</li>
          <li>© {new Date().getFullYear()} Pixel</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      Pixel n'est pas affilié à Vinted. Conçu avec ❤️ pour les vendeurs.
    </div>
  </footer>
);
