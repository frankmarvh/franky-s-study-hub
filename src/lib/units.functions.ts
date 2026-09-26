import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getUnitContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { data: unit, error } = await context.supabase
      .from("materials")
      .select("id,title,description,subject,course,unit_code,level,content,material_type")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("Could not load unit");
    if (!unit) throw new Error("Unit not found");
    if (unit.content) return unit;

    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI not configured");
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { generateText } = await import("ai");
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const { text } = await generateText({
      model: lovable.responses("openai/gpt-6-astra"),
      system:
        "You write complete, accurate study notes for Kenyan university and college units (CUE, KNEC, KASNEB, TVET, KMTC curricula). Output Markdown only: an overview, learning outcomes, detailed topic-by-topic notes with examples (Kenyan context where relevant), key terms, a summary, and 10 revision questions with brief answers.",
      prompt: `Unit: ${unit.title}${unit.unit_code ? ` (${unit.unit_code})` : ""}\nSubject: ${unit.subject}\nCourse: ${unit.course ?? ""}\nLevel: ${unit.level ?? ""}\nDescription: ${unit.description}`,
      providerOptions: { openai: { forceReasoning: true, reasoningEffort: "low" } },
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("materials").update({ content: text }).eq("id", unit.id);
    return { ...unit, content: text };
  });
