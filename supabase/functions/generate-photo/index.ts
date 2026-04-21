// Edge function: generate a product photo using Lovable AI Gateway (Gemini image edit).
// CORS open. Auth optional (guests get 1 free preview). Authed users consume 1 credit.
// Returns { image: "data:image/png;base64,..." }.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Server-side allowlist for sol surfaces (mirrors src/data/sols.ts prompts).
const SOL_PROMPTS: Record<string, string> = {
  oak: "natural light oak parquet wood floor with soft warm window daylight from the left, very subtle realistic shadows",
  marble: "polished white Calacatta marble surface with subtle gray veining and soft daylight, premium look",
  linen: "warm beige natural linen fabric backdrop with soft folds and gentle directional daylight",
  concrete: "smooth polished gray concrete floor with even soft daylight, contemporary minimalist surface",
  walnut: "rich dark walnut wood floor with visible grain and warm moody directional lighting",
  plaster: "smooth cream off-white seamless paper photography backdrop with soft even diffused lighting",
};

const LIGHT_PROMPTS: Record<string, string> = {
  "soft-window": "Lumière naturelle de fenêtre, douce et flatteuse",
  "golden-hour": "Lumière chaude et dorée, fin d'après-midi",
  studio: "Éclairage studio uniforme, sans ombres dures",
  moody: "Ombres marquées, ambiance dramatique",
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB decoded
const MAX_HINT_LEN = 200;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ---- Auth (optional) ----
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    let userId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      // Ignore the anon JWT used by guests
      if (token && token !== anonKey) {
        const sb = createClient(supabaseUrl, anonKey);
        const { data: claimsData, error: claimsErr } = await sb.auth.getClaims(token);
        if (!claimsErr && claimsData?.claims?.sub) {
          userId = claimsData.claims.sub as string;
        }
      }
    }

    // Authed users: consume 1 credit atomically. If 0 → 402.
    if (userId) {
      const admin = createClient(supabaseUrl, serviceKey);
      const { data: ok, error: rpcErr } = await admin.rpc("consume_credit", { _user_id: userId });
      if (rpcErr) {
        console.error("consume_credit error", rpcErr);
        return new Response(JSON.stringify({ error: "Erreur crédits." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!ok) {
        return new Response(JSON.stringify({ error: "Crédits épuisés", code: "NO_CREDITS" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY missing");
      return new Response(JSON.stringify({ error: "Service indisponible." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- Input validation ----
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Requête invalide." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { imageBase64, solId, lightId, articleHint } = body as Record<string, unknown>;

    if (typeof imageBase64 !== "string" || !imageBase64.startsWith("data:image/")) {
      return new Response(JSON.stringify({ error: "Image invalide." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Estimate decoded size: base64 length * 3/4
    const b64payload = imageBase64.split(",")[1] ?? "";
    if ((b64payload.length * 3) / 4 > MAX_IMAGE_BYTES) {
      return new Response(JSON.stringify({ error: "Image trop volumineuse (max 10 MB)." }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const solPrompt = typeof solId === "string" ? SOL_PROMPTS[solId] : undefined;
    const lightPrompt = typeof lightId === "string" ? LIGHT_PROMPTS[lightId] : undefined;
    if (!solPrompt || !lightPrompt) {
      return new Response(JSON.stringify({ error: "Sol ou lumière invalide." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let safeHint = "";
    if (typeof articleHint === "string") {
      safeHint = articleHint.replace(/[\x00-\x1F\x7F]/g, "").trim().slice(0, MAX_HINT_LEN);
    }

    const instruction = `You are a professional product photographer for the Vinted second-hand fashion marketplace.
Re-shoot the article shown in the input photo as a real, natural product photograph laid flat on the following surface: ${solPrompt}.
Lighting: ${lightPrompt}.
The article${safeHint ? ` (${safeHint})` : ""} must remain IDENTICAL in shape, color, fabric, prints and details — do not redesign it. Only change the background surface, lighting, shadows and overall photographic quality.
Output a photorealistic, high-resolution shot, top-down or slight 3/4 angle, with realistic soft contact shadows. No text, no watermark, no people. The result must look like a real iPhone product photo, NOT a 3D render or illustration.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: instruction },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("AI gateway error", res.status, t);
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un instant." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: "Service momentanément indisponible." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Erreur génération IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const image = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!image) {
      console.error("No image in response", JSON.stringify(data).slice(0, 800));
      return new Response(JSON.stringify({ error: "Pas d'image dans la réponse IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ image }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-photo error:", e);
    return new Response(JSON.stringify({ error: "Une erreur est survenue. Réessayez." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
