export type Locale = "en" | "fr";

export const translations = {
  en: {
    nav: {
      features: "Features",
      howItWorks: "How it Works",
      pricing: "Pricing",
      dashboard: "Enterprise Portal",
    },
    hero: {
      badge: "🍁 Quebec Enterprise Matchmaker",
      title1: "Autonomous B2B Matchmaking",
      title2: "for Quebec Enterprises",
      description: "Valora connects local enterprise vendors with qualified corporate buyers through AI-driven procurement matchmaking, automated NEQ validation, and smart RFP routing.",
      ctaPrimary: "Find Matches Now",
      ctaSecondary: "Browse Listings",
      stats: {
        matches: "Autonomous Matches Weekly",
        verified: "NEQ Verified Businesses",
        volume: "Procurement Volume",
      }
    },
    features: {
      title: "Built for Quebec Procurement",
      subtitle: "Secure, compliance-focused B2B portal matching buyers & sellers in real-time.",
      neq: {
        title: "Quebec NEQ Verification",
        description: "Instant business check using Quebec Business Registry integration, ensuring secure corporate identities.",
      },
      match: {
        title: "Autonomous RFQ Matching",
        description: "AI reads RFP specifications and auto-matches vendors based on capability scoring, capacity, and region.",
      },
      bilingual: {
        title: "Bilingual translation pipeline",
        description: "Seamless English-French localization of bids, RFPs, and communications across Quebec and Canada.",
      },
    },
    onboarding: {
      title: "Welcome to Valora B2B",
      subtitle: "Let's set up your Quebec enterprise profile.",
      step1Title: "Select Company Role",
      step1Desc: "Are you primarily posting procurement requests (Buyer) or looking for contracts (Vendor)?",
      buyer: "Corporate Buyer",
      buyerDesc: "Post RFPs, request bids, and discover local vendors.",
      vendor: "Enterprise Vendor",
      vendorDesc: "Browse procurement listings, match with RFPs, and bid.",
      step2Title: "Quebec Business Info",
      neqPlaceholder: "10-digit NEQ (Numéro d'entreprise du Québec)",
      neqValid: "Valid NEQ! Enterprise verified.",
      neqInvalid: "NEQ must be a 10-digit number.",
      industry: "Industry / Sector",
      companyName: "Enterprise Name",
      complete: "Complete Setup",
      success: "Profile successfully created! Welcome to Valora B2B.",
    }
  },
  fr: {
    nav: {
      features: "Fonctionnalités",
      howItWorks: "Fonctionnement",
      pricing: "Tarification",
      dashboard: "Portail Entreprise",
    },
    hero: {
      badge: "🍁 Jumelage d'entreprises du Québec",
      title1: "Jumelage B2B Autonome",
      title2: "pour les entreprises d'ici",
      description: "Valora connecte les fournisseurs locaux aux acheteurs corporatifs grâce à un jumelage d'approvisionnement piloté par l'IA, une validation NEQ automatique et un ciblage intelligent des appels d'offres.",
      ctaPrimary: "Trouver des contrats",
      ctaSecondary: "Parcourir les offres",
      stats: {
        matches: "Jumelages autonomes / sem.",
        verified: "Entreprises vérifiées (NEQ)",
        volume: "Volume d'approvisionnement",
      }
    },
    features: {
      title: "Conçu pour l'approvisionnement québécois",
      subtitle: "Portail B2B sécurisé et conforme, reliant acheteurs et vendeurs en temps réel.",
      neq: {
        title: "Validation NEQ instantanée",
        description: "Vérification immédiate des entreprises via le Registre des entreprises du Québec pour garantir des transactions sécurisées.",
      },
      match: {
        title: "Jumelage intelligent de DDO",
        description: "L'IA analyse les critères de l'appel d'offres et suggère des fournisseurs qualifiés selon un score de capacité et de région.",
      },
      bilingual: {
        title: "Traduction bidirectionnelle",
        description: "Localisation français-anglais fluide des soumissions et communications à travers le Québec et le Canada.",
      },
    },
    onboarding: {
      title: "Bienvenue sur Valora B2B",
      subtitle: "Configurons le profil de votre entreprise québécoise.",
      step1Title: "Choisir le rôle",
      step1Desc: "Publiez-vous des demandes d'approvisionnement (Acheteur) ou cherchez-vous des contrats (Fournisseur) ?",
      buyer: "Acheteur Corporatif",
      buyerDesc: "Publiez des appels d'offres et découvrez des fournisseurs d'ici.",
      vendor: "Fournisseur local",
      vendorDesc: "Parcourez les demandes et postulez aux appels d'offres.",
      step2Title: "Informations d'entreprise",
      neqPlaceholder: "NEQ à 10 chiffres (Numéro d'entreprise du Québec)",
      neqValid: "NEQ valide ! Entreprise authentifiée.",
      neqInvalid: "Le NEQ doit contenir 10 chiffres.",
      industry: "Secteur d'activité",
      companyName: "Nom de l'entreprise",
      complete: "Finaliser l'inscription",
      success: "Profil créé avec succès ! Bienvenue sur Valora B2B.",
    }
  }
};
