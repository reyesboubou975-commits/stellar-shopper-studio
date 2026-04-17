import { Layout } from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { loadHistory, type GenRecord } from "@/lib/history";
import { SOLS } from "@/data/sols";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Camera, Heart, Clock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

const Dashboard = () => {
  const [history, setHistory] = useState<GenRecord[]>([]);
  useEffect(() => { setHistory(loadHistory()); }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const solCount: Record<string, number> = {};
    history.forEach(h => { solCount[h.sol] = (solCount[h.sol] || 0) + 1; });
    const favSolId = Object.entries(solCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const favSol = SOLS.find(s => s.id === favSolId) || SOLS[0];
    const minutesSaved = Math.round(total * 4.5); // ~4.5 min saved per pic
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

  return (
    <Layout>
      <div className="container py-10 md:py-14">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Dashboard</div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Tes stats Pixel.</h1>
          </div>
          <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
            <Link to="/studio">Nouvelle photo</Link>
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card icon={Camera} label="Photos générées" value={stats.total.toString()} hint={`+${stats.lastWeek} cette semaine`} />
          <Card icon={Heart} label="Sol favori" value={stats.favSol.name} hint={stats.favSol.tagline} image={stats.favSol.image} />
          <Card icon={Clock} label="Temps économisé" value={`${stats.minutesSaved} min`} hint="vs studio photo manuel" />
          <Card icon={Zap} label="Vitesse moyenne" value="8s" hint="par photo" highlight />
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
      </div>
    </Layout>
  );
};

const Card = ({ icon: Icon, label, value, hint, image, highlight }: {
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
