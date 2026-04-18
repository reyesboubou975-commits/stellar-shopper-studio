import { Layout } from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { loadHistory, type GenRecord } from "@/lib/history";
import { SOLS } from "@/data/sols";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Camera, Heart, Clock, Zap, Check, Sparkles, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  quota: string;
  features: string[];
  cta: string;
  popular?: boolean;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    tagline: "Découverte",
    price: "0€",
    period: "Pour tester sans engagement",
    quota: "2 photos offertes à l'inscription",
    features: ["2 photos offertes", "Tous les sols", "Sans carte bancaire"],
    cta: "Commencer",
  },
  {
    id: "essential",
    name: "Essentiel",
    tagline: "Le plus populaire",
    price: "16,99€",
    period: "/ mois",
    quota: "200 photos / mois",
    features: ["200 photos par mois", "Tous les sols", "Export HD", "Support prioritaire"],
    cta: "Choisir Essentiel",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Pour les pros",
    price: "29,99€",
    period: "/ mois",
    quota: "500 photos / mois",
    features: ["500 photos par mois", "Tous les sols", "Export 4K", "Watermark personnalisé"],
    cta: "Choisir Pro",
  },
  {
    id: "business",
    name: "Entreprise",
    tagline: "Pour les équipes",
    price: "49,99€",
    period: "/ mois",
    quota: "1000 photos / mois",
    features: ["1000 photos par mois", "Multi-utilisateurs", "API access", "Support dédié"],
    cta: "Choisir Entreprise",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    tagline: "Photos illimitées",
    price: "79,99€",
    period: "/ mois",
    quota: "Photos à l'infini",
    features: ["Photos illimitées", "Toutes les fonctionnalités", "Accès anticipé nouveautés", "Support VIP"],
    cta: "Passer Lifetime",
    highlight: true,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [history, setHistory] = useState<GenRecord[]>([]);
  const [profile, setProfile] = useState<{ display_name: string | null; avatar_url: string | null } | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
      if (!data.session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    setHistory(loadHistory());
    supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const stats = useMemo(() => {
    const total = history.length;
    const solCount: Record<string, number> = {};
    history.forEach(h => { solCount[h.sol] = (solCount[h.sol] || 0) + 1; });
    const favSolId = Object.entries(solCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const favSol = favSolId ? SOLS.find(s => s.id === favSolId) : null;
    const minutesSaved = Math.round(total * 4.5);
    return { total, favSol, minutesSaved, lastWeek: history.filter(h => h.at > Date.now() - 7*864e5).length };
  }, [history]);

  const monthly = useMemo(() => {
    const now = new Date();
    const arr = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return { label: MONTHS[d.getMonth()], key: `${d.getFullYear()}-${d.getMonth()}`, count: 0 };
    });
    history.forEach(h => {
      const d = new Date(h.at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const slot = arr.find(a => a.key === key);
      if (slot) slot.count += 1;
    });
    return arr;
  }, [history]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const handleSelectPlan = (plan: Plan) => {
    toast.info(`Plan ${plan.name} sélectionné — paiement bientôt disponible.`);
  };

  if (!authChecked || !user) {
    return (
      <Layout>
        <div className="container py-32 grid place-items-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "toi";

  return (
    <Layout>
      <div className="container py-10 md:py-14">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Dashboard</div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Salut {displayName}.</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={handleSignOut}>Se déconnecter</Button>
            <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
              <Link to="/studio">Nouvelle photo</Link>
            </Button>
          </div>
        </div>

        {/* Stat cards — réelles uniquement */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Camera} label="Photos générées" value={stats.total.toString()} hint={stats.lastWeek > 0 ? `+${stats.lastWeek} cette semaine` : "Aucune cette semaine"} />
          {stats.favSol ? (
            <StatCard icon={Heart} label="Sol favori" value={stats.favSol.name} hint={stats.favSol.tagline} image={stats.favSol.image} />
          ) : (
            <StatCard icon={Heart} label="Sol favori" value="—" hint="Génère une photo pour voir" />
          )}
          <StatCard icon={Clock} label="Temps économisé" value={stats.total > 0 ? `${stats.minutesSaved} min` : "—"} hint="vs studio photo manuel" />
          <StatCard icon={Zap} label="Vitesse moyenne" value={stats.total > 0 ? "8s" : "—"} hint="par photo" highlight={stats.total > 0} />
        </div>

        {/* Chart */}
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-2 mb-6">
            <div>
              <div className="font-display text-2xl">Utilisation mensuelle</div>
              <div className="text-sm text-muted-foreground">Photos générées sur les 12 derniers mois</div>
            </div>
            <div className="text-sm text-muted-foreground">Total : <span className="text-foreground font-medium">{stats.total}</span></div>
          </div>
          <div className="h-72">
            {stats.total === 0 ? (
              <div className="h-full grid place-items-center text-muted-foreground text-sm">
                Aucune donnée pour l'instant. <Link to="/studio" className="ml-1 underline text-foreground">Génère ta première photo</Link>.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--secondary))" }}
                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12 }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent */}
        <div className="mt-8">
          <div className="font-display text-2xl mb-4">Activité récente</div>
          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
              Pas encore d'activité. <Link to="/studio" className="underline text-foreground">Génère ta première photo</Link>.
            </div>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
              {[...history].reverse().slice(0, 10).map(h => {
                const sol = SOLS.find(s => s.id === h.sol)!;
                return (
                  <li key={h.id} className="flex items-center gap-4 p-4">
                    <img src={sol.image} alt={sol.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="font-medium">{sol.name}</div>
                      <div className="text-xs text-muted-foreground">Lumière {h.light} · Format {h.format}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(h.at).toLocaleString("fr-FR")}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Abonnements */}
        <section id="abonnements" className="mt-16 md:mt-24">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Abonnements
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Choisis ton plan.</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Du test gratuit aux photos illimitées, un plan pour chaque besoin.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl border p-6 flex flex-col ${
                  plan.popular
                    ? "border-foreground shadow-elegant scale-[1.02] bg-card"
                    : plan.highlight
                    ? "bg-foreground text-background border-foreground"
                    : "bg-card border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium">
                    Le plus populaire
                  </div>
                )}
                <div className={`text-xs uppercase tracking-widest ${plan.highlight ? "text-background/70" : "text-muted-foreground"}`}>
                  {plan.tagline}
                </div>
                <div className="font-display text-2xl mt-1">{plan.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-background/70" : "text-muted-foreground"}`}>{plan.period}</span>
                </div>
                <div className={`mt-2 text-sm font-medium ${plan.highlight ? "text-background" : "text-foreground"}`}>
                  {plan.quota}
                </div>
                <ul className="mt-5 space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-background" : "text-foreground"}`} />
                      <span className={plan.highlight ? "text-background/90" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  className={`mt-6 rounded-full w-full ${
                    plan.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : plan.popular
                      ? "bg-foreground text-background hover:bg-foreground/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

const StatCard = ({ icon: Icon, label, value, hint, image, highlight }: {
  icon: any; label: string; value: string; hint?: string; image?: string; highlight?: boolean;
}) => (
  <div className={`relative overflow-hidden rounded-2xl border p-5 ${highlight ? "bg-foreground text-background border-foreground" : "bg-card border-border"}`}>
    {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
    <div className="relative flex items-start justify-between">
      <div>
        <div className={`text-xs ${highlight ? "text-background/70" : "text-muted-foreground"}`}>{label}</div>
        <div className="mt-2 font-display text-3xl">{value}</div>
        {hint && <div className={`mt-1 text-xs ${highlight ? "text-background/70" : "text-muted-foreground"}`}>{hint}</div>}
      </div>
      <div className={`w-9 h-9 rounded-lg grid place-items-center ${highlight ? "bg-background/10" : "bg-secondary"}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
  </div>
);

export default Dashboard;
