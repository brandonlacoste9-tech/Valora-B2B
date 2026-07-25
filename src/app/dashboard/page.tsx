"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Locale, translations } from "@/lib/translations";
import { createClient } from "@/lib/supabase/client";
import { createProcurementAction, getDashboardDataAction } from "@/app/actions/procurements";

export default function DashboardPage() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"buyer" | "vendor">("buyer");
  const [data, setData] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleFr, setTitleFr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descFr, setDescFr] = useState("");
  const [reqEn, setReqEn] = useState("");
  const [reqFr, setReqFr] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [msg, setMsg] = useState("");

  const supabase = createClient();
  const t = translations[locale];

  useEffect(() => {
    const saved = localStorage.getItem("valora_locale") as Locale;
    if (saved === "en" || saved === "fr") {
      setLocale(saved);
    }

    async function loadSession() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await refreshDashboard(viewMode);
      }
      setLoading(false);
    }
    loadSession();
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("valora_locale", newLocale);
  };

  const refreshDashboard = async (role: "buyer" | "vendor") => {
    const res = await getDashboardDataAction(role);
    if (res.ok) {
      setData(res.data);
    }
  };

  const handleModeChange = async (mode: "buyer" | "vendor") => {
    setViewMode(mode);
    if (user) {
      setLoading(true);
      await refreshDashboard(mode);
      setLoading(false);
    }
  };

  const handleMockSignIn = async () => {
    // Standard anonymous check for quick demo testing
    const { data: authData, error } = await supabase.auth.signInAnonymously();
    if (error) {
      alert(`Demo login failed: ${error.message}`);
    } else {
      setUser(authData.user);
      setLoading(true);
      await refreshDashboard(viewMode);
      setLoading(false);
    }
  };

  const handleCreateRfp = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    startTransition(async () => {
      const res = await createProcurementAction({
        titleEn,
        titleFr,
        descriptionEn: descEn,
        descriptionFr: descFr,
        requirementsEn: reqEn,
        requirementsFr: reqFr,
        budgetDollars: Number(budget) || 0,
        deadlineIso: deadline,
      });

      if (res.ok) {
        setMsg("RFP successfully created! AI Matchmaking running...");
        setTitleEn("");
        setTitleFr("");
        setDescEn("");
        setDescFr("");
        setReqEn("");
        setReqFr("");
        setBudget("");
        setDeadline("");
        await refreshDashboard(viewMode);
      } else {
        setMsg(`Error: ${res.error}`);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      
      {/* Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 sticky top-0 z-40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚜️</span>
            <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              VALORA
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded">
              B2B
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex rounded-full border border-zinc-800 p-1 bg-zinc-900/50">
              <button
                onClick={() => changeLocale("en")}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                  locale === "en" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLocale("fr")}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                  locale === "fr" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500"
                }`}
              >
                FR
              </button>
            </div>

            {user && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  setData(null);
                }}
                className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Sign Out / Déconnexion
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        
        {/* Auth Gate for testing */}
        {!user ? (
          <div className="mx-auto max-w-md text-center py-20 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">Enterprise Login</h2>
              <p className="text-sm text-zinc-400">
                Sign in to verify your NEQ details and view matchmaking bids.
              </p>
            </div>
            <button
              onClick={handleMockSignIn}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-bold py-3.5 hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg hover:shadow-emerald-500/25"
            >
              Sign In with Mock Account (Demo Access)
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Dashboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-6">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {locale === "fr" ? "Portail Entreprise" : "Enterprise Portal"}
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Active Org: <span className="text-zinc-300 font-semibold">{data?.role === "buyer" ? "Hydro-Québec (Acheteur)" : "Québec Métal (Fournisseur)"}</span>
                </p>
              </div>

              {/* Mode switch */}
              <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => handleModeChange("buyer")}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    viewMode === "buyer" ? "bg-zinc-800 text-emerald-400 shadow" : "text-zinc-500"
                  }`}
                >
                  Buyer Mode (Post RFPs)
                </button>
                <button
                  onClick={() => handleModeChange("vendor")}
                  className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                    viewMode === "vendor" ? "bg-zinc-800 text-cyan-400 shadow" : "text-zinc-500"
                  }`}
                >
                  Vendor Mode (View Matches)
                </button>
              </div>
            </div>

            {/* Buyer View */}
            {viewMode === "buyer" && (
              <div className="grid gap-8 lg:grid-cols-12 items-start">
                
                {/* RFP Creator Form */}
                <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 space-y-4">
                  <h3 className="text-lg font-bold text-zinc-200">
                    {locale === "fr" ? "Créer un appel d'offres" : "Create Procurement RFP"}
                  </h3>
                  
                  <form onSubmit={handleCreateRfp} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Title (FR)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Approvisionnement pièces métalliques"
                        value={titleFr}
                        onChange={(e) => setTitleFr(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Title (EN)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Metal Parts Procurement"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-400">Budget ($ CAD)</label>
                        <input
                          type="number"
                          required
                          placeholder="50000"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-zinc-400">Deadline / Date limite</label>
                        <input
                          type="date"
                          required
                          value={deadline}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none text-zinc-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-zinc-400">Requirements / Critères spécifiques (FR)</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Détaillez les qualifications nécessaires..."
                        value={reqFr}
                        onChange={(e) => setReqFr(e.target.value)}
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full rounded-xl bg-emerald-500 text-zinc-950 font-bold py-2.5 text-sm hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                    >
                      {isPending ? "Creating / Jumelage..." : "Post RFP & AI Match"}
                    </button>

                    {msg && <p className="text-xs text-emerald-400 mt-2 text-center">{msg}</p>}
                  </form>
                </div>

                {/* RFP List */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-lg font-bold text-zinc-200">
                    {locale === "fr" ? "Appels d'offres en cours" : "Active Procurement Postings"}
                  </h3>

                  <div className="space-y-3">
                    {data?.procurements.map((rfp: any) => (
                      <div key={rfp.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-bold text-zinc-100">
                            {locale === "fr" ? rfp.title_fr : rfp.title_en}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            {rfp.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {locale === "fr" ? rfp.requirements_fr : rfp.requirements_en}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs text-zinc-500">
                          <span>Budget: ${(Number(rfp.budget_cents || 0) / 100).toLocaleString()} CAD</span>
                          <span>Deadline: {new Date(rfp.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Vendor View */}
            {viewMode === "vendor" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-200">
                  {locale === "fr" ? "Mes jumelages d'appels d'offres" : "Matched Procurement Opportunities"}
                </h3>

                <div className="space-y-4">
                  {data?.matches.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border border-zinc-800 bg-zinc-900/10 text-zinc-500">
                      No active matches generated yet. Post an RFP in Buyer Mode to trigger the AI Matchmaker!
                    </div>
                  ) : (
                    data?.matches.map((match: any) => (
                      <div key={match.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-4 hover:border-cyan-500/20 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                              RFP Matching Target
                            </span>
                            <h4 className="text-lg font-bold text-zinc-100 mt-1">
                              {locale === "fr" ? match.procurements.title_fr : match.procurements.title_en}
                            </h4>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-2xl font-extrabold text-cyan-400">
                              {match.score}%
                            </span>
                            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Match Score</span>
                          </div>
                        </div>

                        <div className="rounded-xl bg-zinc-950/60 p-4 border border-zinc-905">
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                            {locale === "fr" ? "Justification de l'IA" : "AI Match Justification"}
                          </p>
                          <p className="text-sm text-zinc-300 leading-relaxed">
                            {locale === "fr" ? match.reasoning_fr : match.reasoning_en}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <span>Buyer: {match.procurements.organizations?.name || "Hydro-Sud"}</span>
                          <span>Budget: ${(Number(match.procurements.budget_cents || 0) / 100).toLocaleString()} CAD</span>
                          <span className="ml-auto text-cyan-400 underline cursor-pointer">Submit Proposal</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}
