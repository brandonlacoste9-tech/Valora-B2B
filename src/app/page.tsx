"use client";

import { useEffect, useState } from "react";
import { Locale, translations } from "@/lib/translations";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("valora_locale") as Locale;
    if (saved === "en" || saved === "fr") {
      setLocale(saved);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("valora_locale", newLocale);
  };

  const t = translations[locale];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 font-sans relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚜️</span>
            <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              VALORA
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded ml-2">
              B2B
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition-colors">
              {t.nav.features}
            </a>
            <a href="#how" className="hover:text-zinc-100 transition-colors">
              {t.nav.howItWorks}
            </a>
            <a href="#pricing" className="hover:text-zinc-100 transition-colors">
              {t.nav.pricing}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex rounded-full border border-zinc-800 p-1 bg-zinc-900/50">
              <button
                type="button"
                onClick={() => changeLocale("en")}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-all ${
                  locale === "en" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => changeLocale("fr")}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-all ${
                  locale === "fr" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                FR
              </button>
            </div>

            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="rounded-full bg-zinc-100 text-zinc-950 font-bold px-4 py-1.5 text-xs hover:bg-zinc-200 transition-colors shadow-lg"
            >
              {t.nav.dashboard}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 sm:px-8 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-bold text-emerald-400 shadow-sm">
              {t.hero.badge}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t.hero.title1}
              <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {t.hero.title2}
              </span>
            </h1>

            <p className="max-w-xl text-lg text-zinc-400 leading-relaxed mx-auto lg:mx-0">
              {t.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 font-bold px-8 py-3.5 text-sm hover:from-emerald-400 hover:to-cyan-400 shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
              >
                {t.hero.ctaPrimary}
              </button>
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="w-full sm:w-auto rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-200 font-bold px-8 py-3.5 text-sm hover:bg-zinc-900 transition-colors"
              >
                {t.hero.ctaSecondary}
              </button>
            </div>
          </div>

          {/* Interactive Widget Dashboard Mock */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 blur-xl pointer-events-none" />
            <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl p-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{t.hero.widget.title}</span>
                </div>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">{t.hero.widget.portal}</span>
              </div>

              {/* Feed simulation */}
              <div className="space-y-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <span>99% {t.hero.widget.score}</span>
                    <span>{t.hero.widget.now}</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-200">{t.hero.widget.rfp1}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{t.hero.widget.vendor1}</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 opacity-80">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <span>97% {t.hero.widget.score}</span>
                    <span>3 {t.hero.widget.minsAgo}</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300">{t.hero.widget.rfp2}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{t.hero.widget.vendor2}</p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 opacity-60">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <span>94% {t.hero.widget.score}</span>
                    <span>12 {t.hero.widget.minsAgo}</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-400">{t.hero.widget.rfp3}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{t.hero.widget.vendor3}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-zinc-900 bg-zinc-950/50 py-12 px-6 sm:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
          <div className="space-y-1">
            <p className="text-4xl font-extrabold text-emerald-400">2,480+</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">{t.hero.stats.verified}</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-extrabold text-cyan-400">14,250</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">{t.hero.stats.matches}</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-extrabold text-emerald-400">$84.6M+</p>
            <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500">{t.hero.stats.volume}</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 sm:px-8 mx-auto max-w-7xl space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{t.features.title}</h2>
          <p className="text-zinc-400 text-sm sm:text-base">{t.features.subtitle}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 hover:border-emerald-500/20 transition-all hover:bg-zinc-900/30">
            <span className="text-3xl mb-4 block">🛡️</span>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">{t.features.neq.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t.features.neq.description}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 hover:border-cyan-500/20 transition-all hover:bg-zinc-900/30">
            <span className="text-3xl mb-4 block">🤖</span>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">{t.features.match.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t.features.match.description}</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-8 hover:border-emerald-500/20 transition-all hover:bg-zinc-900/30">
            <span className="text-3xl mb-4 block">🗣️</span>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">{t.features.bilingual.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t.features.bilingual.description}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 Valora B2B. {t.footer.rights} ⚜️ {t.footer.compliance}</p>
      </footer>

      {/* Onboarding Flow Modal */}
      <OnboardingFlow
        locale={locale}
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
