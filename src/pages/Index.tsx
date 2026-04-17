import { Link } from "react-router-dom";
import { ArrowRight, Camera, Wand2, Layers, Zap, ShieldCheck, TrendingUp, Star, Quote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { BeforeAfter } from "@/components/BeforeAfter";
import { SOLS } from "@/data/sols";
import hero from "@/assets/hero-jacket.jpg";
import before from "@/assets/before-sneaker.jpg";
import after from "@/assets/after-sneaker.jpg";

const FEATURES = [
  { icon: Camera, title: "Sols 100% réels", desc: "Parquet, marbre, lin, béton… des surfaces photographiées en vrai. Pas de fond IA flou." },
  { icon: Wand2, title: "Lumière de pro", desc: "Choisis ton ambiance : fenêtre douce, golden hour, studio ou moody — l'IA recompose la lumière." },
  { icon: Layers, title: "Batch illimité", desc: "Upload 50 photos d'un coup. Pixel les retraite toutes en parallèle pendant que tu prends un café." },
  { icon: Zap, title: "8 secondes / photo", desc: "Notre pipeline Gemini optimisé sort tes shots en moins de 10 secondes. Live preview en temps réel." },
  { icon: ShieldCheck, title: "Article inchangé", desc: "L'IA ne touche jamais à ton article — couleurs, coupe, étiquettes, tout est préservé pixel par pixel." },
  { icon: TrendingUp, title: "+217% de ventes*", desc: "Les vendeurs Pixel vendent en moyenne 3,17× plus vite que la concurrence sur Vinted." },
];

const TESTIMONIALS = [
  { name: "Léa M.", handle: "@lea_dressing", text: "J'ai vidé tout mon dressing en 2 semaines. Avant ça mettait 4 mois. Pixel a changé ma vie de vendeuse.", stars: 5 },
  { name: "Karim T.", handle: "@vintage.karim", text: "Le sol noyer pour mes pièces vintage, c'est cheat. Mes annonces sortent direct dans les coups de cœur.", stars: 5 },
  { name: "Sofia R.", handle: "@sofia.thrift", text: "J'ai testé toutes les apps. Pixel est la SEULE qui ne déforme pas mes pièces. Je ne reviendrai jamais en arrière.", stars: 5 },
];

const Index = () => {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" aria-hidden />
        <div className="container relative pt-12 md:pt-20 pb-20 md:pb-32 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur border border-border text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Nouveau · Studio IA pour vendeurs Vinted
            </div>
            <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] font-medium">
              Tes photos Vinted,<br />
              <span className="italic text-warm">enfin dignes</span><br />
              <span className="text-muted-foreground">d'un magazine.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">
              Pixel transforme tes photos amateur en clichés pro sur sols réels — chêne, marbre, lin, béton.
              Upload, choisis ton ambiance, télécharge. <strong className="text-foreground">8 secondes.</strong>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full h-14 px-7 text-base bg-foreground text-background hover:bg-foreground/90 shadow-elev">
                <Link to="/studio">Lancer le studio <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-7 text-base">
                <Link to="/sols">Voir les sols</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand text-brand" />)}
                <span className="ml-1 font-medium text-foreground">4,9/5</span>
              </div>
              <div>+12 400 vendeurs actifs</div>
              <div className="hidden sm:block">+1,2M photos générées</div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-elev animate-scale-in">
              <img src={hero} alt="Veste en jean photographiée par Pixel" className="w-full h-full object-cover" width={1280} height={1600} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-white/30">
                <div className="text-xs text-muted-foreground">Sol · Lin naturel · Lumière fenêtre</div>
                <div className="text-sm font-medium mt-0.5">Veste en jean vintage — 32€</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-elev animate-float">
              Vendu en 2h ⚡
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border bg-background py-6 overflow-hidden">
        <div className="flex gap-12 marquee whitespace-nowrap text-2xl md:text-3xl font-display italic text-muted-foreground">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center shrink-0">
              <span>Vinted</span><span>·</span><span>Vestiaire Collective</span><span>·</span><span>Depop</span><span>·</span><span>Etsy</span><span>·</span><span>Leboncoin</span><span>·</span><span>eBay</span><span>·</span>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE AFTER */}
      <section className="container py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="text-sm uppercase tracking-widest text-muted-foreground">Le résultat</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">
            Glisse pour voir<br /><span className="italic text-warm">la différence.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Une basket banale photographiée sur une moquette… devient une pièce désirable sur parquet de chêne.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
          <BeforeAfter before={before} after={after} />
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-secondary border border-border">
              <div className="text-sm text-muted-foreground">Avant — photo iPhone</div>
              <div className="mt-2 text-2xl font-display">Sneaker · 12€</div>
              <div className="mt-1 text-muted-foreground">Vendue en 47 jours</div>
            </div>
            <div className="p-6 rounded-2xl bg-foreground text-background border border-foreground">
              <div className="text-sm text-background/60">Après — Pixel sur chêne clair</div>
              <div className="mt-2 text-2xl font-display">Sneaker · 28€</div>
              <div className="mt-1 text-background/70">Vendue en 6 heures · +133% prix</div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLS PREVIEW */}
      <section className="container py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Catalogue</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">6 sols. <span className="italic text-warm">Zéro fake.</span></h2>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/sols">Tout voir <ArrowRight className="ml-1 w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {SOLS.map((sol, i) => (
            <Link
              key={sol.id}
              to="/sols"
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-soft animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img src={sol.image} alt={sol.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
                <div className="text-xs opacity-80">{sol.tagline}</div>
                <div className="font-display text-xl md:text-2xl">{sol.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-24">
        <div className="max-w-2xl mb-16">
          <div className="text-sm uppercase tracking-widest text-muted-foreground">Pourquoi Pixel</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">Tout pour vendre <span className="italic text-warm">plus vite, plus cher.</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-card border border-border hover:shadow-elev transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-secondary grid place-items-center mb-4"><f.icon className="w-5 h-5" /></div>
              <h3 className="font-display text-xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-4">*Données internes Pixel sur 4 200 vendeurs, T1 2026.</div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-foreground text-background py-24 md:py-32">
        <div className="container">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-widest text-background/60">Comment ça marche</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl">Trois étapes. <span className="italic text-brand-2">Une seule photo géniale.</span></h2>
          </div>
          <div className="mt-16 grid md:grid-cols-3 gap-10">
            {[
              { n: "01", t: "Upload", d: "Glisse-dépose tes photos brutes — iPhone, Android, peu importe." },
              { n: "02", t: "Choisis", d: "Sélectionne ton sol, ta lumière, ton format. Live preview instantané." },
              { n: "03", t: "Télécharge", d: "Récupère un ZIP optimisé Vinted. Prêt à publier." },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div className="font-display text-7xl text-brand-2/40">{s.n}</div>
                <h3 className="mt-2 font-display text-3xl">{s.t}</h3>
                <p className="mt-3 text-background/70">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <Button asChild size="lg" className="rounded-full h-14 px-7 bg-background text-foreground hover:bg-background/90">
              <Link to="/studio">Essayer maintenant <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-24">
        <div className="max-w-2xl mb-12">
          <div className="text-sm uppercase tracking-widest text-muted-foreground">Vendeurs Pixel</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl leading-tight">Ils ont <span className="italic text-warm">tout vendu.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="p-6 rounded-2xl bg-secondary border border-border">
              <Quote className="w-6 h-6 text-brand mb-4" />
              <blockquote className="font-display text-lg leading-snug">{t.text}</blockquote>
              <figcaption className="mt-6 flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.handle}</div>
                </div>
                <div className="flex">{[...Array(t.stars)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand text-brand" />)}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="container py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="text-sm uppercase tracking-widest text-muted-foreground">Tarifs</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">Simple. <span className="italic text-warm">Honnête.</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { n: "Découverte", p: "0€", per: "/ pour toujours", f: ["10 photos / mois", "3 sols inclus", "Téléchargement individuel", "Filigrane Pixel"], cta: "Commencer", v: "outline" as const },
            { n: "Vendeur", p: "9€", per: "/ mois", f: ["200 photos / mois", "6 sols + 4 lumières", "Batch & ZIP", "Sans filigrane", "Stats personnelles"], cta: "Choisir Vendeur", v: "default" as const, hl: true },
            { n: "Pro", p: "29€", per: "/ mois", f: ["Photos illimitées", "Sols personnalisés", "API d'export Vinted", "Support prioritaire"], cta: "Passer Pro", v: "outline" as const },
          ].map((t) => (
            <div key={t.n} className={`p-8 rounded-3xl border ${t.hl ? "bg-foreground text-background border-foreground shadow-elev" : "bg-card border-border"}`}>
              <div className="font-display text-2xl">{t.n}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <div className="font-display text-5xl">{t.p}</div>
                <div className={t.hl ? "text-background/60" : "text-muted-foreground"}>{t.per}</div>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {t.f.map(li => <li key={li} className="flex gap-2"><Check className={`w-4 h-4 mt-0.5 ${t.hl ? "text-brand-2" : "text-brand"}`} />{li}</li>)}
              </ul>
              <Button asChild className={`mt-8 w-full rounded-full ${t.hl ? "bg-background text-foreground hover:bg-background/90" : ""}`} variant={t.v}>
                <Link to="/studio">{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-warm p-10 md:p-20 text-center">
          <div className="absolute inset-0 bg-mesh opacity-40" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-7xl text-white leading-tight">Vide ton dressing.<br /><span className="italic">Pas ton temps.</span></h2>
            <p className="mt-6 text-white/90 text-lg max-w-xl mx-auto">10 photos offertes. Sans CB. Sans engagement. Juste pour voir si ça marche pour toi.</p>
            <Button asChild size="lg" className="mt-8 rounded-full h-14 px-8 bg-foreground text-background hover:bg-foreground/90">
              <Link to="/studio">Lancer le studio <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
