import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ActiviteDuMois from "./components/ActiviteDuMois";
import Catalogue from "./components/Catalogue";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";

import BookingModal from "./components/BookingModal";
import ExperiencesPage from "./components/ExperiencesPage";
import CorporatePage from "./components/CorporatePage";
import ContactPage from "./components/ContactPage";
import AdminPanel from "./components/AdminPanel";

import { getMonthlyActivity, MonthlyActivity, DEFAULT_MONTHLY_ACTIVITY } from "./lib/firebase";

interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogImage: string;
  robots?: string;
}

const getSEOMetadata = (view: string, monthlyAct: MonthlyActivity): SEOMetadata => {
  switch (view) {
    case "experiences":
      return {
        title: "Nos Expériences Immersives | Trippin Babi",
        description: "Explorez notre catalogue exclusif d'expériences culturelles et d'ateliers authentiques en Côte d'Ivoire. Rencontrez des producteurs locaux, maîtres chocolatiers et herboristes d'exception.",
        keywords: "expériences, catalogue de voyage, Côte d'Ivoire, activités Abidjan, Assinie, chocolat de luxe, tourisme responsable",
        ogTitle: "Découvrez Nos Expériences Culturelles Exclusives",
        ogDescription: "Réservez nos ateliers d'immersion d'exception. De la fabrication de chocolat maison à l'exploration guidée des mangroves sauvages.",
        ogType: "website",
        ogImage: "https://trippin-babi.com/cocoa_artisan_1781884316543.jpg"
      };
    case "activities":
      return {
        title: `L'Activité du Mois : ${monthlyAct.title || "Immersion Cacao"} | Trippin Babi`,
        description: `Participez à notre immersion phare ce mois-ci : ${monthlyAct.title} ${monthlyAct.italicTitle || ""}. ${monthlyAct.description || "Un atelier participatif d'apprentissage au cœur de la gastronomie et de l'artisanat de Côte d'Ivoire."}`,
        keywords: "activité du mois, atelier cacao, chocolatier Abidjan, excursion de luxe, culture ivoirienne, apprentissage insolite",
        ogTitle: `Activité Exclusive : ${monthlyAct.title}`,
        ogDescription: monthlyAct.description || "Une immersion unique d'excellence et de partage culturel.",
        ogType: "article",
        ogImage: "https://trippin-babi.com/cocoa_artisan_1781884316543.jpg"
      };
    case "corporate":
      return {
        title: "Corporate & Team Building d'Exception | Trippin Babi",
        description: "Fédérez vos équipes autour de la richesse culturelle ivoirienne : séminaires de prestige, rallyes sensoriels, ateliers d'orfèvrerie et team building gastronomique.",
        keywords: "corporate, incentive, team building, séminaire Abidjan, cohésion d'équipe, événementiel entreprise, safari d'art",
        ogTitle: "Team Building & Séminaires d'Entreprise Haut de Gamme",
        ogDescription: "Vos événements professionnels réinventés. Alliez excellence, culture d'entreprise et immersion culturelle authentique.",
        ogType: "website",
        ogImage: "https://trippin-babi.com/colonial_mansion_1781884298621.jpg"
      };
    case "contact":
      return {
        title: "Contactez Nos Artisans de Voyage | Trippin Babi",
        description: "Vous avez un projet d'immersion, de séjour privé sur-mesure ou d'événement corporate ? Contactez notre conciergerie locale pour imaginer votre aventure.",
        keywords: "contact, conciergerie de voyage, réserver séjour, devis voyage personnalisé Côte d'Ivoire, organiser team building, assistance touristique",
        ogTitle: "Planifiez Votre Prochaine Immersion Culturelle",
        ogDescription: "Contactez l'équipe de Trippin Babi pour concevoir ou réserver votre aventure immersive haut de gamme.",
        ogType: "website",
        ogImage: "https://trippin-babi.com/cocoa_artisan_1781884316543.jpg"
      };
    case "admin":
      return {
        title: "Tableau de Bord Administrateur | Trippin Babi",
        description: "Espace d'administration sécurisé de Trippin Babi.",
        keywords: "admin, dashboard, gestion",
        ogTitle: "Admin Dashboard - Trippin Babi",
        ogDescription: "Espace réservé à la direction.",
        ogType: "website",
        ogImage: "https://trippin-babi.com/cocoa_artisan_1781884316543.jpg",
        robots: "noindex, nofollow"
      };
    case "home":
    default:
      return {
        title: "Trippin Babi | Immersions Culturelles d'Exception en Côte d'Ivoire",
        description: "Créez des souvenirs mémorables en Côte d'Ivoire avec Trippin Babi. Séjours d'immersion haut de gamme, masterclasses culinaires et explorations de patrimoines de prestige.",
        keywords: "Trippin Babi, Côte d'Ivoire, voyage abidjan, expériences immersives, tourisme de luxe, chocolat artisanal, voyage organisé afrique de l'ouest",
        ogTitle: "Trippin Babi | Créateur d'Immersions d'Exception",
        ogDescription: "Explorez l'art de vivre, l'artisanat sacré et la haute gastronomie de Côte d'Ivoire avec notre conciergerie locale d'excellence.",
        ogType: "website",
        ogImage: "https://trippin-babi.com/cocoa_artisan_1781884316543.jpg"
      };
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  
  // Dynamic Activity of the Month state loadable from Firestore
  const [monthlyActivity, setMonthlyActivity] = useState<MonthlyActivity>(DEFAULT_MONTHLY_ACTIVITY);
  const [isActivityLoading, setIsActivityLoading] = useState<boolean>(true);

  // Booking Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedActivityForBooking, setSelectedActivityForBooking] = useState("");

  // Load Firestore Data
  async function loadMonthlyActivityData() {
    try {
      const fetchedActivity = await getMonthlyActivity();
      setMonthlyActivity(fetchedActivity);
    } catch (err) {
      console.error("Failed to load activity from database, using defaults:", err);
    } finally {
      setIsActivityLoading(false);
    }
  }

  // Load Firestore Data on bootstrap
  useEffect(() => {
    loadMonthlyActivityData();
  }, []);

  // Smooth Navigation wrapper that scrolls to the top of the viewport
  function handleNavigate(viewId: string) {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Handle category navigation from homepage catalogue
  function handleExploreCategory(category: string) {
    setActiveCategoryFilter(category);
    setCurrentView("experiences");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Open booking modal for specific item
  function triggerBooking(activityTitle: string) {
    setSelectedActivityForBooking(activityTitle);
    setIsBookingOpen(true);
  }

  const seo = getSEOMetadata(currentView, monthlyActivity);

  return (
    <div className="bg-[#FAF6EE] min-h-screen text-[#352115] relative flex flex-col font-sans selection:bg-[#E8E0D5]">
      
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={seo.ogType} />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:site_name" content="Trippin Babi" />
        <meta property="og:url" content={window.location.origin + (currentView === "home" ? "" : `?view=${currentView}`)} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content={seo.ogImage} />

        {/* Dynamic robots indexing */}
        {seo.robots && <meta name="robots" content={seo.robots} />}
      </Helmet>

      {/* Dynamic Header */}
      <Header currentView={currentView} onNavigate={handleNavigate} />


      {/* Primary Transition views container using Framer Motion */}
      <main className="flex-grow animate-[fadeIn_0.5s_ease-out]">
        <AnimatePresence mode="wait">
          {currentView === "home" && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-0"
            >
              <Hero 
                onDiscover={() => handleNavigate("experiences")} 
                onCorporate={() => handleNavigate("corporate")} 
              />
              
              <ActiviteDuMois 
                activity={monthlyActivity} 
                onBook={() => triggerBooking(monthlyActivity.title + " " + monthlyActivity.italicTitle)} 
                onViewProgram={() => triggerBooking(monthlyActivity.title + " " + monthlyActivity.italicTitle)} 
              />
              
              <Catalogue 
                onExploreCategory={handleExploreCategory} 
                onExploreAll={() => handleExploreCategory("all")} 
              />
              
              <CallToAction 
                onPlanTrip={() => triggerBooking("Séjour sur-mesure")} 
                onGroupQuote={() => handleNavigate("corporate")} 
              />
            </motion.div>
          )}

          {currentView === "experiences" && (
            <motion.div
              key="experiences-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ExperiencesPage 
                onBook={triggerBooking} 
                initialFilter={activeCategoryFilter} 
              />
            </motion.div>
          )}

          {currentView === "activities" && (
            <motion.div
              key="activities-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Detailed display section specifically focused on Activity of the Month */}
              <div className="pb-12 bg-[#FAF6EE]">
                <ActiviteDuMois 
                  activity={monthlyActivity} 
                  onBook={() => triggerBooking(monthlyActivity.title + " " + monthlyActivity.italicTitle)} 
                  onViewProgram={() => triggerBooking(monthlyActivity.title + " " + monthlyActivity.italicTitle)} 
                />
                
                {/* Embedded dynamic details from database matching the program */}
                <div className="max-w-3xl mx-auto py-16 px-6 text-left space-y-6">
                  <h3 className="text-3xl font-serif text-[#352115] font-light border-b border-[#E8E0D5] pb-4">
                    Le Programme en détail
                  </h3>
                  <div className="text-[#7E695D] font-sans text-sm md:text-base leading-relaxed space-y-4 font-light select-text">
                    <p>
                      C'est un voyage gustatif exceptionnel au cœur du cacao ivoirien, premier producteur mondial. Au-delà d'une simple dégustation de chocolat classique, nous vous ouvrons les portes des secrets de fabrication artisanale, de la récolte de la cabosse mûre jusqu'au produit d'exception que vous dégusterez fièrement.
                    </p>
                    <p>
                      Guidé par nos maîtres chocolatiers agréés locaux d'Abidjan, cet atelier participatif est un moment de symbiose parfaite entre savoir-faire traditionnel et raffinement premium.
                    </p>
                    {monthlyActivity.programmeComplet ? (
                      <div className="bg-[#EFEAE0] p-6 border border-[#E8E0D5] rounded-xs mt-6 space-y-3 font-serif italic text-[#352115]">
                        <h4 className="text-lg font-bold">Inclus dans la formule :</h4>
                        <p className="whitespace-pre-line font-sans not-italic text-sm text-[#7E695D]">
                          {monthlyActivity.programmeComplet}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#EFEAE0] p-6 border border-[#E8E0D5] rounded-xs mt-6 space-y-3 font-serif italic text-[#352115]">
                        <h4 className="text-lg font-bold">Détails pratiques :</h4>
                        <ul className="list-disc pl-5 font-sans not-italic text-sm text-[#7E695D] space-y-2">
                          <li>Sont inclus : l'ensemble des matières premières, les tabliers de travail, l'eau rafraîchissante et votre tablette personnalisée à emporter chez vous.</li>
                          <li>Lieu de rendez-vous : Atelier La Cacaoterie, Cocody, Abidjan.</li>
                          <li>Conseillé pour adultes et enfants à partir de 8 ans.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === "corporate" && (
            <motion.div
              key="corporate-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CorporatePage />
            </motion.div>
          )}

          {currentView === "contact" && (
            <motion.div
              key="contact-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ContactPage />
            </motion.div>
          )}

          {currentView === "admin" && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel onActivityUpdated={loadMonthlyActivityData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Footer */}
      <Footer onNavigate={handleNavigate} onExploreCategory={handleExploreCategory} />

      {/* Unified Booking Modal Overlay */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        defaultActivityTitle={selectedActivityForBooking} 
      />

    </div>
  );
}
