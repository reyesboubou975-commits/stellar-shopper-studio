// Edge function: generate a product photo using Lovable AI Gateway (Gemini image edit).
// CORS open. Receives { imageBase64, solPrompt, lightPrompt, articleHint }.
// Returns { image: "data:image/png;base64,..." }.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, solPrompt, lightPrompt, articleHint } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
    if (!imageBase64) throw new Error("imageBase64 required");

    const instruction = `You are a professional product photographer for the Vinted second-hand fashion marketplace.
Re-shoot the article shown in the input photo as a real, natural product photograph laid flat on the following surface: ${solPrompt}.
Lighting: ${lightPrompt}.
The article${articleHint ? ` (${articleHint})` : ""} must remain IDENTICAL in shape, color, fabric, prints and details — do not redesign it. Only change the background surface, lighting, shadows and overall photographic quality.
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
        return new Response(JSON.stringify({ error: "Crédits IA épuisés. Ajoutez du crédit dans les réglages Lovable." }), {
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
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
