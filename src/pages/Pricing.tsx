import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "9€",
    period: "/mois",
    credits: 100,
    icon: Sparkles,
    features: ["100 photos par mois", "Tous les sols & lumières", "Export HD", "Support email"],
    cta: "Commencer",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "29€",
    period: "/mois",
    credits: 500,
    icon: Zap,
    features: ["500 photos par mois", "Génération en batch", "Export HD + 4K", "Support prioritaire", "Historique illimité"],
    cta: "Passer au Pro",
    popular: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: "99€",
    period: "/mois",
    credits: 2500,
    icon: Crown,
    features: ["2 500 photos par mois", "API access", "Sols personnalisés", "Manager dédié", "Facturation entreprise"],
    cta: "Contacter",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <Layout>
      <div className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-sm uppercase tracking-widest text-muted-foreground">Tarifs</div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl tracking-tight">Choisis ton plan Pixel.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Crée des photos studio en quelques secondes. 10 crédits offerts à l'inscription, sans carte.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={cn(
                  "relative p-7 rounded-3xl border bg-card flex flex-col",
                  p.popular ? "border-foreground shadow-elev scale-[1.02]" : "border-border"
                )}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium">
                    Le plus choisi
                  </div>
                )}
                <div className="w-11 h-11 rounded-2xl bg-warm shadow-glow grid place-items-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="font-display text-2xl">{p.name}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl">{p.price}</span>
                  <span className="text-muted-foreground text-sm">{p.period}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{p.credits} crédits / mois</div>
                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={cn(
                    "mt-7 rounded-full",
                    p.popular ? "bg-foreground text-background hover:bg-foreground/90" : ""
                  )}
                  variant={p.popular ? "default" : "outline"}
                >
                  <Link to="/auth">{p.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Paiements bientôt disponibles. Pour l'instant, profite de tes 10 crédits gratuits à l'inscription.
        </p>
      </div>
    </Layout>
  );
};

export default Pricing;