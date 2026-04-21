-- Ajout colonne pour identifier les utilisateurs Lifetime (crédits illimités)
ALTER TABLE public.user_credits
ADD COLUMN IF NOT EXISTS unlimited BOOLEAN NOT NULL DEFAULT false;

-- Nouvelle version : consomme N crédits (default 5). Bypass si unlimited.
CREATE OR REPLACE FUNCTION public.consume_credit(_user_id UUID, _amount INTEGER DEFAULT 5)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _ok BOOLEAN := false;
  _unlimited BOOLEAN := false;
BEGIN
  -- S'assure qu'une ligne existe (cas legacy)
  INSERT INTO public.user_credits (user_id, credits) VALUES (_user_id, 10)
  ON CONFLICT (user_id) DO NOTHING;

  -- Lifetime : on incrémente le compteur d'usage mais on ne débite rien
  SELECT unlimited INTO _unlimited FROM public.user_credits WHERE user_id = _user_id;
  IF _unlimited THEN
    UPDATE public.user_credits
    SET total_generated = total_generated + 1
    WHERE user_id = _user_id;
    RETURN true;
  END IF;

  UPDATE public.user_credits
  SET credits = credits - _amount, total_generated = total_generated + 1
  WHERE user_id = _user_id AND credits >= _amount
  RETURNING true INTO _ok;

  RETURN COALESCE(_ok, false);
END; $$;