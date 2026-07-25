"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { runMatchmaking } from "@/lib/ai/matcher";

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

/**
 * Ensures user has an active profile and mock organization for local testing convenience.
 */
async function getOrCreateMockOrg(supabase: any, userId: string, preferredRole: "buyer" | "vendor") {
  // Check if profile exists
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    const { data: newProfile, error: profileErr } = await supabase
      .from("profiles")
      .insert({ id: userId, display_name: "Mock User", preferred_language: "fr" })
      .select()
      .single();
    if (profileErr) throw profileErr;
    profile = newProfile;
  }

  // Check if organization membership exists
  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, organizations(*)")
    .eq("profile_id", userId)
    .maybeSingle();

  if (membership) {
    return { orgId: membership.org_id, role: membership.organizations.role };
  }

  // Create mock organization
  const orgName = preferredRole === "buyer" ? "Hydro-Québec (Acheteur corporatif)" : "Québec Métal Inc. (Fournisseur)";
  const { data: newOrg, error: orgErr } = await supabase
    .from("organizations")
    .insert({
      name: orgName,
      neq: preferredRole === "buyer" ? "1112223334" : "5556667778",
      role: preferredRole,
      industry: "manufacturing",
      size: "50-199",
      description_en: "Leading Quebec enterprise entity.",
      description_fr: "Entité québécoise de premier plan.",
    })
    .select()
    .single();

  if (orgErr) throw orgErr;

  // Create membership link
  const { error: memberErr } = await supabase
    .from("memberships")
    .insert({
      profile_id: userId,
      org_id: newOrg.id,
      role: "owner",
    });

  if (memberErr) throw memberErr;

  return { orgId: newOrg.id, role: preferredRole };
}

export async function createProcurementAction(input: {
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  requirementsEn: string;
  requirementsFr: string;
  budgetDollars: number;
  deadlineIso: string;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    
    // Get active user session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, error: "Authentication required." };
    }

    const { orgId } = await getOrCreateMockOrg(supabase, user.id, "buyer");

    const budgetCents = Math.round(input.budgetDollars * 100);

    const { data: rfp, error } = await supabase
      .from("procurements")
      .insert({
        org_id: orgId,
        title_en: input.titleEn,
        title_fr: input.titleFr,
        description_en: input.descriptionEn,
        description_fr: input.descriptionFr,
        requirements_en: input.requirementsEn,
        requirements_fr: input.requirementsFr,
        budget_cents: budgetCents,
        deadline: input.deadlineIso ? new Date(input.deadlineIso).toISOString() : null,
        status: "open",
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    // Trigger AI Matchmaking pipeline
    try {
      await runMatchmaking(rfp.id);
    } catch (e) {
      console.warn("AI matchmaking run skipped or failed: ", e);
    }

    revalidatePath("/dashboard");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "RFP creation failed",
    };
  }
}

export async function getDashboardDataAction(preferredRole: "buyer" | "vendor") {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, error: "Not logged in" };
    }

    const { orgId, role } = await getOrCreateMockOrg(supabase, user.id, preferredRole);

    // Fetch RFPs
    const { data: procurements } = await supabase
      .from("procurements")
      .select("*, organizations(name)")
      .order("created_at", { ascending: false });

    // Fetch matches for the active organization
    let matches = [];
    if (role === "vendor" || preferredRole === "vendor") {
      const { data: matchData } = await supabase
        .from("matches")
        .select("*, procurements(*, organizations(name))")
        .eq("vendor_org_id", orgId)
        .order("score", { ascending: false });
      matches = matchData || [];
    } else {
      // For buyers, get matches on their own procurements
      const { data: matchData } = await supabase
        .from("matches")
        .select("*, procurements!inner(org_id, title_en, title_fr), organizations(*)")
        .eq("procurements.org_id", orgId)
        .order("score", { ascending: false });
      matches = matchData || [];
    }

    return {
      ok: true,
      data: {
        role,
        orgId,
        procurements: procurements || [],
        matches,
      },
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to load dashboard data",
    };
  }
}
