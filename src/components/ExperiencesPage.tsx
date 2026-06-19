import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Users, Clock, Tag, ChevronRight } from "lucide-react";
import { ActivityCard } from "../types";

interface ExperiencesPageProps {
  onBook: (activityTitle: string) => void;
  initialFilter?: string;
}

export default function ExperiencesPage({ onBook, initialFilter = "all" }: ExperiencesPageProps) {
  const [filter, setFilter] = useState<string>(initialFilter);

  // List of premium authentic tourist activities
  const activities: ActivityCard[] = [
    {
      id: "at-cuisine",
      indexCode: "05",
      title: "Secrets de Mijoterie",
      category: "ateliers",
      description: "Apprenez l'art des sauces ivoiriennes traditionnelles (Gouagouassou, Kpala, Kedjenou de poulet fermier) au feu de bois avec des mères de famille locales d'Abidjan.",
      details: "Préparation complète de 3 plats traditionnels suivi d'un déjeuner convivial partagé.",
      paxLimit: "4 pax min.",
      price: "35 000 F",
      duration: "4 h"
    },
    {
      id: "at-batik",
      indexCode: "05",
      title: "Teinture Artisanale Batik",
      category: "ateliers",
      description: "Initiez-vous aux techniques séculaires de teinture à la cire d'abeille et d'indigo avec des teinturiers professionnels de Grand-Bassam.",
      details: "Créez et repartez avec votre propre coupon de tissu 100% coton personnalisé.",
      paxLimit: "2 pax min.",
      price: "30 000 F",
      duration: "3.5 h"
    },
    {
      id: "at-sculpture",
      indexCode: "05",
      title: "Sculpture sur Bois d'Ébène",
      category: "ateliers",
      description: "Taillez un masque d'inspiration sénoufo ou yacouba sous l'oeil bienveillant d'un artisan sculpteur dans son atelier de la lisière d'Abidjan.",
      details: "Découverte des différentes essences de bois nobles et polissage final.",
      paxLimit: "2 pax min.",
      price: "40 000 F",
      duration: "4 h"
    },
    {
      id: "at-infuserie",
      indexCode: "05",
      title: "Arômes de l'Infuserie",
      category: "ateliers",
      description: "Plongez dans les secrets des plantes médicinales locales et de la théologie horticole d'Adzopé. Composez vos propres mélanges d'infusions bien-être.",
      details: "Atelier aromatique olfactif avec un herboriste diplômé.",
      paxLimit: "3 pax min.",
      price: "25 000 F",
      duration: "2.5 h"
    },
    {
      id: "jr-bassam",
      indexCode: "03",
      title: "Échappée Historique à Bassam",
      category: "journees",
      description: "Une journée hors du temps dans la cité historique classée à l'UNESCO. Architecture coloniale, phare centenaire, déjeuner de fruits de mer en bordure d'Atlantique.",
      details: "Visite guidée par un historien et balade exclusive en pirogue lagunaire.",
      paxLimit: "4 pax min.",
      price: "55 000 F",
      duration: "8 h"
    },
    {
      id: "jr-assinie",
      indexCode: "03",
      title: "L'éden Sauvage d'Assinie-Mafia",
      category: "journees",
      description: "Journée d'évasion nautique sur la lisière exclusive d'Assinie. Entre lagune sauvage bordée de palétuviers et l'océan Atlantique chaleureux.",
      details: "Navigation privée, baignade, farniente écologique et déjeuner traditionnel les pieds dans l'eau.",
      paxLimit: "6 pax min.",
      price: "75 000 F",
      duration: "10 h"
    },
    {
      id: "cr-senufo",
      indexCode: "04",
      title: "Sur les Terres du Peuple Sifolo",
      category: "circuits",
      description: "Une odyssée spirituelle de 3 jours dans le grand Nord ivoirien, de Korhogo à Boundiali. Découvrez le rythme sacré des Senufo, les fileuses de coton et la danse du panthère.",
      details: "Hébergement éco-lodge de standing, transport 4x4 privé et guides rituels locaux agréés.",
      paxLimit: "4 pax min.",
      price: "280 000 F",
      duration: "3 Jours"
    },
    {
      id: "tb-escape",
      indexCode: "03",
      title: "Team building Escape City",
      category: "team-building",
      description: "Une chasse aux énigmes grandeur nature dans le Plateau d'Abidjan ou les ruines de Cocody. Idéal pour stimuler l'esprit de cohésion, de stratégie et d'histoire locale.",
      details: "Animateurs professionnels dédiés, carte géolocalisée interactive et rafraîchissements.",
      paxLimit: "10 pax min.",
      price: "25 000 F / pers.",
      duration: "3 h"
    }
  ];

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(act => act.category === filter);

  const categoriesMap = [
    { id: "all", label: "TOUT" },
    { id: "ateliers", label: "ATELIERS" },
    { id: "journees", label: "JOURNÉES" },
    { id: "circuits", label: "CIRCUITS" },
    { id: "team-building", label: "TEAM BUILDING" }
  ];

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16 px-6 md:px-12 max-w-7xl mx-auto" id="experiences-page">
      
      {/* Title block */}
      <div className="space-y-4 mb-12 text-center md:text-left">
        <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">
          AVENTURES ET APPRENTISSAGE
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#352115] font-light tracking-tight max-w-2xl">
          Découvrez notre catalogue
        </h1>
        <p className="text-sm text-[#7E695D] font-sans font-light max-w-xl">
          Toutes nos immersions sont dessinées avec respect du patrimoine ivoirien, limitant la taille des groupes pour une préservation authentique de l'instant.
        </p>
      </div>

      {/* Filter Header Rail */}
      <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4 pb-8 border-b border-[#E8E0D5] mb-12" id="filter-rail">
        {categoriesMap.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`text-[10px] md:text-xs font-bold tracking-[0.2em] px-5 py-3 border transition-all duration-300 uppercase cursor-pointer ${
              filter === cat.id
                ? "bg-[#352115] border-[#352115] text-white"
                : "border-[#E8E0D5] text-[#7E695D] hover:border-[#352115] hover:text-[#352115]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid displays filtered components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="experiences-grid">
        {filteredActivities.map((act, idx) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-[#FAF6EE] border border-[#E8E0D5] p-6 hover:shadow-lg hover:border-[#9A6F4C]/40 transition-all duration-300 flex flex-col justify-between h-[420px] relative group"
            id={`experience-item-${act.id}`}
          >
            {/* Index code label */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5]/50">
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#9A6F4C]">
                {act.indexCode} · {act.category.toUpperCase()}
              </span>
              <span className="text-xs font-serif font-bold text-[#352115]">
                {act.price}
              </span>
            </div>

            {/* Typography content and metadata description */}
            <div className="py-6 flex-1 flex flex-col justify-start space-y-4">
              <h3 className="text-xl md:text-2xl font-serif text-[#352115] font-light leading-tight group-hover:text-[#9A6F4C] transition-colors duration-200">
                {act.title}
              </h3>
              
              <p className="text-xs md:text-sm text-[#7E695D] font-sans font-light leading-relaxed line-clamp-3">
                {act.description}
              </p>

              {/* Extended meta data bullets */}
              <div className="pt-3 space-y-2 text-[11px] font-sans text-[#7E695D]/80">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-[#9A6F4C] shrink-0" />
                  <span>DURÉE : <strong>{act.duration}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-[#9A6F4C] shrink-0" />
                  <span>GROUPE : <strong>{act.paxLimit}</strong></span>
                </div>
              </div>
            </div>

            {/* Book trigger panel footer */}
            <div className="border-t border-[#E8E0D5]/50 pt-4 flex items-center justify-between">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7E695D] uppercase">
                EXPLOREZ AUJOURD'HUI
              </span>
              <button
                onClick={() => onBook(act.title)}
                className="bg-[#352115] hover:bg-[#9A6F4C] text-[#FAF6EE] text-[9px] font-bold tracking-[0.18em] px-4 py-3.5 transition-colors uppercase cursor-pointer"
              >
                RÉSERVER
              </button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
