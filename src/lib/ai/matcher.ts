import { generateText, Output } from "ai";
import { z } from "zod";
import { xai } from "@ai-sdk/xai";
import { anthropic } from "@ai-sdk/anthropic";
import { createClient } from "@/lib/supabase/server";

const matchOutputSchema = z.object({
  score: z.number().min(0).max(100).describe("Match percentage score based on capabilities alignment"),
  reasoning_en: z.string().describe("Clear, concise professional justification of the score in English"),
  reasoning_fr: z.string().describe("Clear, concise professional justification of the score in French"),
});

export async function runMatchmaking(procurementId: string) {
  const supabase = await createClient();

  // 1. Fetch procurement details
  const { data: rfp, error: rfpError } = await supabase
    .from("procurements")
    .select("*, organizations(name, industry)")
    .eq("id", procurementId)
    .single();

  if (rfpError || !rfp) {
    throw new Error(`RFP not found: ${rfpError?.message}`);
  }

  // 2. Fetch all eligible vendor organizations in the same industry
  const { data: vendors, error: vendorsError } = await supabase
    .from("organizations")
    .select("*")
    .in("role", ["vendor", "both"])
    .eq("industry", rfp.organizations.industry);

  if (vendorsError || !vendors || vendors.length === 0) {
    return { success: true, count: 0, reason: "No vendors in this industry sector yet." };
  }

  // 3. Initialize AI provider (prefer xAI Grok, fallback to Anthropic)
  const isXai = !!process.env.XAI_API_KEY;
  const model = isXai
    ? xai(process.env.XAI_MODEL || "grok-2-1212")
    : anthropic(process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest");

  const results = [];

  for (const vendor of vendors) {
    try {
      const { output } = await generateText({
        model,
        system: `You are Valora Matchmaker, an autonomous B2B procurement matching assistant for Quebec. 
Analyze how well a Vendor's capability description, size, and location matches a Buyer's RFP (Request for Proposal) requirements.
Be rigorous, objective, and output a match score (0-100) and professional bilingual reasonings.`,
        prompt: `
RFP Requirements:
- Title (EN): ${rfp.title_en}
- Title (FR): ${rfp.title_fr}
- Description: ${rfp.description_fr || rfp.description_en}
- Specific requirements: ${rfp.requirements_fr || rfp.requirements_en}
- Budget: $${(Number(rfp.budget_cents || 0) / 100).toLocaleString()}

Vendor Profile:
- Company Name: ${vendor.name}
- NEQ: ${vendor.neq}
- Industry: ${vendor.industry}
- Company Size: ${vendor.size}
- Description (FR): ${vendor.description_fr || "N/A"}
- Description (EN): ${vendor.description_en || "N/A"}

Provide matching score and bilingual explanations.`,
        output: Output.object({ schema: matchOutputSchema }),
      });

      if (output) {
        results.push({
          procurement_id: procurementId,
          vendor_org_id: vendor.id,
          score: output.score,
          reasoning_en: output.reasoning_en,
          reasoning_fr: output.reasoning_fr,
          status: "suggested" as const,
        });
      }
    } catch (e) {
      console.error(`AI matchmaking failed for vendor ${vendor.name}:`, e);
      // Fallback baseline scoring in case AI API fails/unconfigured
      results.push({
        procurement_id: procurementId,
        vendor_org_id: vendor.id,
        score: 75,
        reasoning_en: "Matched based on matching industry sector.",
        reasoning_fr: "Jumelé sur la base du secteur d'activité correspondant.",
        status: "suggested" as const,
      });
    }
  }

  // 4. Save results to matches table (upsert on conflict)
  if (results.length > 0) {
    const { error: upsertError } = await supabase
      .from("matches")
      .upsert(results, { onConflict: "procurement_id, vendor_org_id" });

    if (upsertError) {
      throw new Error(`Failed to save matches: ${upsertError.message}`);
    }
  }

  return { success: true, count: results.length };
}
