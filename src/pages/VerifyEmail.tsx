import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Mail, Loader2, CheckCircle2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "";
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    document.title = "Vérifie ton email · Pixel";
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/dashboard", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email manquant. Recommence l'inscription.");
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setResending(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email renvoyé !");
      setCooldown(30);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-background via-background to-secondary/30 px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-warm shadow-glow grid place-items-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-semibold">Pixel</span>
        </Link>

        <Card className="p-8 shadow-elegant text-center">
          <div className="w-16 h-16 rounded-full bg-warm/10 grid place-items-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-warm" />
          </div>

          <h1 className="font-display text-2xl font-semibold mb-3">
            Vérifie ton adresse email
          </h1>

          <p className="text-muted-foreground mb-2">
            On vient d'envoyer un lien de confirmation à
          </p>
          {email && (
            <p className="font-medium mb-6 break-all">{email}</p>
          )}

          <div className="space-y-3 text-left bg-secondary/40 rounded-lg p-4 mb-6 text-sm">
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-warm shrink-0 mt-0.5" />
              <span>Ouvre ta boîte mail (pense à vérifier les spams)</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-warm shrink-0 mt-0.5" />
              <span>Clique sur le bouton de confirmation</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-warm shrink-0 mt-0.5" />
              <span>Tu seras redirigé vers ton dashboard</span>
            </div>
          </div>

          <Button
            onClick={handleResend}
            variant="outline"
            className="w-full"
            disabled={resending || cooldown > 0}
          >
            {resending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : cooldown > 0 ? (
              `Renvoyer dans ${cooldown}s`
            ) : (
              "Renvoyer l'email"
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Mauvaise adresse ?{" "}
            <Link to="/auth" className="text-warm hover:underline">
              Recommence l'inscription
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
