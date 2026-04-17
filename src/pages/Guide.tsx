import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Camera, Tag, MessageCircle, TrendingUp, Clock, Search, Sparkles, Shirt } from "lucide-react";

const TIPS = [
  {
    icon: Camera, n: "01", title: "Soigne la première photo",
    body: "C'est la seule visible dans le feed. Plan large, article centré, sol contrasté. Pixel s'occupe du reste.",
  },
  {
    icon: Search, n: "02", title: "Optimise le titre",
    body: "Marque + modèle + taille + matière + couleur. Ex: 'Levi's 501 W30 jean brut bleu'. Vinted indexe chaque mot.",
  },
  {
    icon: Tag, n: "03", title: "Prix juste = vente rapide",
    body: "Regarde 5 annonces vendues similaires. Aligne-toi à -10%. Tu peux remonter ensuite avec les Boost.",
  },
  {
    icon: MessageCircle, n: "04", title: "Réponds en moins d'1h",
    body: "Le taux de conversion chute de 60% après 2h. Active les notifs et reste réactive·f.",
  },
  {
    icon: Clock, n: "05", title: "Republie le mardi 19h",
    body: "Pic de trafic Vinted. Supprime puis republie tes annonces stagnantes pour remonter dans le feed.",
  },
  {
    icon: Shirt, n: "06", title: "Mesures + état = confiance",
    body: "Ajoute toujours longueur, largeur, état précis. Réduit les retours de 70% et booste les notes.",
  },
  {
    icon: TrendingUp, n: "07", title: "Bundle pour vider plus vite",
    body: "Propose -20% pour 3 articles. Tu vendras ton stock 2× plus vite et augmentes ton panier moyen.",
  },
  {
    icon: Sparkles, n: "08", title: "Photos cohérentes = marque perso",
    body: "Utilise toujours le même sol Pixel. Tes acheteurs te reconnaissent et reviennent. C'est de la fidélisation.",
  },
];

const Guide = () => (
  <Layout>
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="container relative py-20 md:py-28">
        <div className="text-sm uppercase tracking-widest text-muted-foreground">Guide vendeur</div>
        <h1 className="mt-3 font-display text-5xl md:text-7xl leading-tight max-w-3xl">
          8 règles pour <span className="italic text-warm">tout vendre</span> sur Vinted.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          On a analysé 47 000 ventes Pixel. Voici ce qui marche vraiment — et ce qui te fait perdre du temps.
        </p>
      </div>
    </section>

    <div className="container py-12 grid md:grid-cols-2 gap-5 max-w-5xl">
      {TIPS.map((t, i) => (
        <article key={t.n} className="p-7 rounded-3xl bg-card border border-border hover:shadow-elev transition-shadow animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary grid place-items-center"><t.icon className="w-5 h-5" /></div>
            <div className="font-display text-3xl text-muted-foreground/40">{t.n}</div>
          </div>
          <h2 className="font-display text-2xl">{t.title}</h2>
          <p className="mt-2 text-muted-foreground">{t.body}</p>
        </article>
      ))}
    </div>

    <section className="container pb-24">
      <div className="rounded-3xl bg-foreground text-background p-10 md:p-16 text-center">
        <h2 className="font-display text-3xl md:text-5xl">Prête·prêt à appliquer la règle n°1 ?</h2>
        <p className="mt-4 text-background/70 max-w-xl mx-auto">Lance Pixel et obtiens des photos qui se vendent. 10 essais gratuits, sans CB.</p>
        <Button asChild className="mt-6 rounded-full h-12 px-7 bg-background text-foreground hover:bg-background/90">
          <Link to="/studio">Ouvrir le studio</Link>
        </Button>
      </div>
    </section>
  </Layout>
);

export default Guide;
