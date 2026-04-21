import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { SOLS, LIGHTS, FORMATS, type SolId, type LightId, type FormatId } from "@/data/sols";
import { Upload, X, Loader2, Download, Wand2, Image as ImageIcon, Check, AlertCircle, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { pushHistory } from "@/lib/history";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface PhotoItem {
  id: string;
  name: string;
  src: string; // data url (original)
  result?: string; // data url (generated)
  status: "idle" | "loading" | "done" | "error";
  error?: string;
}

const fileToDataUrl = (f: File) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result as string);
  r.onerror = rej;
  r.readAsDataURL(f);
});

const Studio = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [sol, setSol] = useState<SolId>("oak");
  const [light, setLight] = useState<LightId>("soft-window");
  const [format, setFormat] = useState<FormatId>("square");
  const [hint, setHint] = useState("");
  const [running, setRunning] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuthed(!!session));
    return () => subscription.unsubscribe();
  }, []);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 50);
    const items: PhotoItem[] = [];
    for (const f of arr) {
      if (!f.type.startsWith("image/")) continue;
      try {
        const src = await fileToDataUrl(f);
        items.push({ id: crypto.randomUUID(), name: f.name, src, status: "idle" });
      } catch { /* skip */ }
    }
    setPhotos(p => [...p, ...items]);
    if (items.length) toast.success(`${items.length} photo${items.length>1?"s":""} ajoutée${items.length>1?"s":""}`);
  }, []);

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); onFiles(e.dataTransfer.files); };

  const removePhoto = (id: string) => setPhotos(p => p.filter(x => x.id !== id));

  const generateOne = async (item: PhotoItem) => {
    if (!isAuthed) { setAuthPromptOpen(true); return; }
    const solDef = SOLS.find(s => s.id === sol)!;
    const lightDef = LIGHTS.find(l => l.id === light)!;
    setPhotos(p => p.map(x => x.id === item.id ? { ...x, status: "loading", error: undefined } : x));
    try {
      const { data, error } = await supabase.functions.invoke("generate-photo", {
        body: {
          imageBase64: item.src,
          solId: solDef.id,
          lightId: lightDef.id,
          articleHint: hint || undefined,
        },
      });
      if (error) throw new Error(error.message || "Erreur réseau");
      if ((data as any)?.error) throw new Error((data as any).error);
      const image = (data as any)?.image as string;
      if (!image) throw new Error("Pas d'image renvoyée");
      setPhotos(p => p.map(x => x.id === item.id ? { ...x, status: "done", result: image } : x));
      pushHistory({ sol, light, format });
    } catch (e: any) {
      const msg = e?.message || "Erreur";
      setPhotos(p => p.map(x => x.id === item.id ? { ...x, status: "error", error: msg } : x));
      toast.error(msg);
    }
  };

  const generateAll = async () => {
    if (running) return;
    if (!isAuthed) { setAuthPromptOpen(true); return; }
    const queue = photos.filter(p => p.status !== "done");
    if (!queue.length) { toast.info("Toutes tes photos sont déjà générées."); return; }
    setRunning(true);
    // Sequential to respect rate limits
    for (const item of queue) {
      // eslint-disable-next-line no-await-in-loop
      await generateOne(item);
    }
    setRunning(false);
    toast.success("Batch terminé ✨");
  };

  const downloadOne = (item: PhotoItem) => {
    if (!item.result) return;
    if (!isAuthed) { setAuthPromptOpen(true); return; }
    const a = document.createElement("a");
    a.href = item.result;
    a.download = `pixel-${sol}-${item.name.replace(/\.[^.]+$/, "")}.png`;
    a.click();
  };

  const downloadAll = () => {
    const done = photos.filter(p => p.result);
    if (!done.length) { toast.info("Rien à télécharger pour l'instant."); return; }
    if (!isAuthed) { setAuthPromptOpen(true); return; }
    done.forEach((p, i) => setTimeout(() => downloadOne(p), i * 250));
  };

  const fmt = FORMATS.find(f => f.id === format)!;

  return (
    <Layout>
      <div className="container py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-sm uppercase tracking-widest text-muted-foreground">Studio</div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Compose ta photo parfaite.</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadAll} disabled={!photos.some(p => p.result)} className="rounded-full">
              <Download className="w-4 h-4 mr-1" /> Télécharger tout
            </Button>
            <Button onClick={generateAll} disabled={running || !photos.length} className="rounded-full bg-foreground text-background hover:bg-foreground/90">
              {running ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Génération…</> : <><Wand2 className="w-4 h-4 mr-1" /> Générer le batch</>}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT — controls */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl border border-border bg-card">
              <div className="text-sm font-medium mb-3">1 · Sol</div>
              <div className="grid grid-cols-3 gap-2">
                {SOLS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSol(s.id)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all",
                      sol === s.id ? "border-foreground shadow-elev scale-[1.02]" : "border-transparent hover:border-border"
                    )}
                    title={s.name}
                  >
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    {sol === s.id && <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground grid place-items-center"><Check className="w-3 h-3 text-background" /></div>}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">{SOLS.find(s=>s.id===sol)?.name} — {SOLS.find(s=>s.id===sol)?.tagline}</div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card">
              <div className="text-sm font-medium mb-3">2 · Lumière</div>
              <div className="grid grid-cols-2 gap-2">
                {LIGHTS.map(l => (
                  <button key={l.id} onClick={() => setLight(l.id)} className={cn(
                    "p-3 rounded-xl text-left text-sm transition-all border",
                    light === l.id ? "bg-foreground text-background border-foreground" : "bg-secondary border-transparent hover:border-border"
                  )}>
                    <div className="font-medium">{l.name}</div>
                    <div className={cn("text-xs mt-0.5", light === l.id ? "text-background/70" : "text-muted-foreground")}>{l.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card">
              <div className="text-sm font-medium mb-3">3 · Format</div>
              <div className="grid grid-cols-3 gap-2">
                {FORMATS.map(f => (
                  <button key={f.id} onClick={() => setFormat(f.id)} className={cn(
                    "p-3 rounded-xl text-center text-xs border transition-all",
                    format === f.id ? "bg-foreground text-background border-foreground" : "bg-secondary border-transparent hover:border-border"
                  )}>
                    <div className="font-medium">{f.name}</div>
                    <div className={cn("text-[10px] mt-0.5", format === f.id ? "text-background/70" : "text-muted-foreground")}>{f.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-border bg-card">
              <label className="text-sm font-medium mb-2 block">4 · Type d'article (optionnel)</label>
              <input
                value={hint} onChange={e => setHint(e.target.value)}
                placeholder="ex: jean Levi's 501, robe Zara, sac cuir…"
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-2 text-xs text-muted-foreground">Aide l'IA à mieux préserver les détails de ton article.</p>
            </div>
          </aside>

          {/* RIGHT — gallery */}
          <section className="lg:col-span-8">
            <div
              onDrop={onDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-foreground/40 hover:bg-secondary/50 transition-all p-10 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-warm grid place-items-center shadow-glow">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="mt-4 font-display text-xl">Dépose tes photos ici</div>
              <div className="text-sm text-muted-foreground mt-1">PNG, JPG · jusqu'à 50 photos · upload instantané</div>
              <input ref={inputRef} type="file" multiple accept="image/*" hidden onChange={e => onFiles(e.target.files)} />
            </div>

            {photos.length > 0 && (
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map(p => (
                  <div key={p.id} className="group relative rounded-2xl overflow-hidden bg-secondary border border-border">
                    <div className="relative aspect-square">
                      <img src={p.result || p.src} alt={p.name} className="w-full h-full object-cover" />
                      {p.status === "loading" && (
                        <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-sm">
                          <Loader2 className="w-6 h-6 animate-spin" />
                        </div>
                      )}
                      {p.status === "done" && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> Pixel
                        </div>
                      )}
                      {p.status === "error" && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Erreur
                        </div>
                      )}
                      <button onClick={() => removePhoto(p.id)} className="absolute top-2 right-2 w-7 h-7 grid place-items-center rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="text-xs text-muted-foreground truncate flex-1">{p.name}</div>
                      {p.result ? (
                        <Button size="sm" variant="ghost" onClick={() => downloadOne(p)} className="h-7 px-2"><Download className="w-3.5 h-3.5" /></Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => generateOne(p)}
                          disabled={p.status === "loading"}
                          className="h-8 px-3 rounded-full bg-warm text-white hover:opacity-90 shadow-glow"
                        >
                          {p.status === "loading" ? (
                            <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> …</>
                          ) : (
                            <><Wand2 className="w-3.5 h-3.5 mr-1" /> Générer</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!photos.length && (
              <div className="mt-6 grid sm:grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
                <div className="p-4 rounded-xl bg-secondary"><ImageIcon className="w-5 h-5 mx-auto mb-2" /> Photo brute iPhone OK</div>
                <div className="p-4 rounded-xl bg-secondary"><Wand2 className="w-5 h-5 mx-auto mb-2" /> 8s par photo</div>
                <div className="p-4 rounded-xl bg-secondary"><Download className="w-5 h-5 mx-auto mb-2" /> Export {fmt.name}</div>
              </div>
            )}
          </section>
        </div>
      </div>

      <Dialog open={authPromptOpen} onOpenChange={setAuthPromptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-warm shadow-glow grid place-items-center mb-3">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="font-display text-2xl">Crée ton compte pour télécharger</DialogTitle>
            <DialogDescription className="text-base">
              Tu peux tester Pixel autant que tu veux. Pour récupérer tes photos en haute qualité, il te faut un compte gratuit.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setAuthPromptOpen(false)} className="rounded-full">
              Continuer à tester
            </Button>
            <Button onClick={() => navigate("/auth")} className="rounded-full bg-foreground text-background hover:bg-foreground/90">
              <Sparkles className="w-4 h-4 mr-1" /> Créer mon compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Studio;
