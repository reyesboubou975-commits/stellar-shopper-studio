import { Layout } from "@/components/Layout";
import { SOLS } from "@/data/sols";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import before from "@/assets/before-sneaker.jpg";
import after from "@/assets/after-sneaker.jpg";

const Sols = () => {
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" aria-hidden />
        <div className="container relative py-20 md:py-28">
          <div className="text-sm uppercase tracking-widest text-muted-foreground">Catalogue</div>
          <h1 className="mt-3 font-display text-5xl md:text-7xl leading-tight max-w-3xl">
            Six sols. <span className="italic text-warm">Tous photographiés.</span> Aucun fake.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            On a refusé le sable réfléchissant et les fonds psychédéliques. On a choisi des surfaces
            que tu pourrais avoir chez toi — celles qui font vraiment vendre sur Vinted.
          </p>
        </div>
      </section>

      <div className="container space-y-24 md:space-y-32 pb-24">
        {SOLS.map((sol, i) => (
          <article key={sol.id} className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center animate-fade-in-up">
            <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-elev">
                <img src={sol.image} alt={sol.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <BeforeAfter before={before} after={after} alt={`${sol.name} avant/après`} />
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-secondary text-sm">
                    <div className="text-muted-foreground text-xs">Idéal pour</div>
                    <div className="mt-1 font-medium">{sol.bestFor.join(" · ")}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary text-sm">
                    <div className="text-muted-foreground text-xs">Vibe</div>
                    <div className="mt-1 font-medium">{sol.vibe}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-foreground text-background text-sm">
                    <div className="text-background/60 text-xs">Conversion moyenne</div>
                    <div className="mt-1 font-display text-2xl">+{20 + i * 8}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <div className="text-sm uppercase tracking-widest text-muted-foreground">Sol n°{String(i+1).padStart(2, "0")}</div>
              <h2 className="mt-3 font-display text-5xl md:text-6xl leading-tight">{sol.name}</h2>
              <div className="mt-2 italic text-warm text-xl font-display">{sol.tagline}</div>
              <p className="mt-6 text-lg text-muted-foreground">{sol.description}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {sol.bestFor.map(b => <li key={b} className="flex gap-2 items-center"><Check className="w-4 h-4 text-brand" /> {b}</li>)}
              </ul>
              <Button asChild className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90">
                <Link to="/studio">Tester ce sol <ArrowRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Layout>
  );
};

export default Sols;
