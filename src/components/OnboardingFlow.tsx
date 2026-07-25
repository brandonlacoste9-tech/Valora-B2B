"use client";

import { useState } from "react";
import { translations, Locale } from "@/lib/translations";

export function OnboardingFlow({
  locale,
  isOpen,
  onClose,
}: {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"vendor" | "buyer" | null>(null);
  const [neq, setNeq] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("manufacturing");
  const [neqError, setNeqError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const t = translations[locale].onboarding;

  const validateNeq = (val: string) => {
    setNeq(val);
    if (!val) {
      setNeqError("");
      return;
    }
    const clean = val.replace(/\D/g, "");
    if (clean.length !== 10) {
      setNeqError(t.neqInvalid);
    } else {
      setNeqError("");
      // Mock company name generation on valid NEQ
      const mockNames = {
        vendor: ["Québec Métal Inc.", "Technologies Alt-FR", "Logistique Laurentides"],
        buyer: ["Hydro-Sud Énergie", "Aliments Transit", "Construction Québec-Est"],
      };
      const arr = role ? mockNames[role] : ["Synergie QC"];
      setCompanyName(arr[Math.floor(Math.random() * arr.length)]);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (neq.replace(/\D/g, "").length !== 10) {
      setNeqError(t.neqInvalid);
      return;
    }
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setStep(1);
      setRole(null);
      setNeq("");
      setCompanyName("");
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl text-zinc-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-3xl animate-bounce">
              ✓
            </div>
            <h3 className="text-xl font-bold text-emerald-400">{t.success}</h3>
            <p className="text-sm text-zinc-400">
              {companyName || "Enterprise"} • NEQ {neq}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-display bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t.title}
              </h2>
              <p className="text-sm text-zinc-400">{t.subtitle}</p>
            </div>

            {step === 1 && (
              <div className="space-y-4 animate-slide-up">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{t.step1Title}</h3>
                  <p className="text-xs text-zinc-400">{t.step1Desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRole("buyer");
                    setStep(2);
                  }}
                  className="flex w-full items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition hover:border-emerald-500/40 hover:bg-zinc-900"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    🏢
                  </span>
                  <div>
                    <h4 className="font-semibold text-zinc-200">{t.buyer}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{t.buyerDesc}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole("vendor");
                    setStep(2);
                  }}
                  className="flex w-full items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition hover:border-cyan-500/40 hover:bg-zinc-900"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                    ⚙️
                  </span>
                  <div>
                    <h4 className="font-semibold text-zinc-200">{t.vendor}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{t.vendorDesc}</p>
                  </div>
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleComplete} className="space-y-4 animate-slide-up">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{t.step2Title}</h3>
                  <p className="text-xs text-zinc-400">
                    Role: <span className="capitalize text-emerald-400">{role}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="neq" className="text-xs font-semibold text-zinc-300">
                    NEQ (Numéro d'entreprise du Québec)
                  </label>
                  <input
                    id="neq"
                    type="text"
                    required
                    placeholder={t.neqPlaceholder}
                    value={neq}
                    onChange={(e) => validateNeq(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  {neqError && <p className="text-xs text-rose-400">{neqError}</p>}
                  {neq.replace(/\D/g, "").length === 10 && !neqError && (
                    <p className="text-xs text-emerald-400">✓ {t.neqValid}</p>
                  )}
                </div>

                {companyName && (
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-xs font-semibold text-zinc-300">
                      {t.companyName}
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="industry" className="text-xs font-semibold text-zinc-300">
                    {t.industry}
                  </label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="manufacturing">Manufacturing / Manufacturier</option>
                    <option value="it">Information Technology / TI</option>
                    <option value="construction">Construction / Bâtiment</option>
                    <option value="logistics">Logistics / Transport</option>
                    <option value="professional_services">Professional Services / Services pro</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-lg border border-zinc-800 py-2.5 text-sm font-medium hover:bg-zinc-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={neq.replace(/\D/g, "").length !== 10}
                    className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-bold py-2.5 text-sm hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {t.complete}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
