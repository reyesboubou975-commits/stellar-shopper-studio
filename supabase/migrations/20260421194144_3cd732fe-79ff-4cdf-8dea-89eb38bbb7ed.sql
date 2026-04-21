-- Table de crédits utilisateur
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  credits INTEGER NOT NULL DEFAULT 10,
  total_generated INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own credits"
  ON public.user_credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Pas d'INSERT/UPDATE par le client : tout passe par les fonctions security definer côté serveur.

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.touch_user_credits()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_touch_user_credits
BEFORE UPDATE ON public.user_credits
FOR EACH ROW EXECUTE FUNCTION public.touch_user_credits();

-- À l'inscription : créer profil + 10 crédits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 10)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction atomique : consomme 1 crédit. Renvoie true si OK, false si épuisé.
CREATE OR REPLACE FUNCTION public.consume_credit(_user_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _ok BOOLEAN := false;
BEGIN
  -- S'assure qu'une ligne existe (cas legacy)
  INSERT INTO public.user_credits (user_id, credits) VALUES (_user_id, 10)
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.user_credits
  SET credits = credits - 1, total_generated = total_generated + 1
  WHERE user_id = _user_id AND credits > 0
  RETURNING true INTO _ok;

  RETURN COALESCE(_ok, false);
END; $$;

-- Backfill : crédits pour utilisateurs existants
INSERT INTO public.user_credits (user_id, credits)
SELECT id, 10 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;