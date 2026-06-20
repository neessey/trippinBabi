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
      id: "eg-signature",
      indexCode: "01",
      title: "Escape games & Chasses urbaines",
      category: "experiences",
      description: "Partez à la découverte de Grand-Bassam, Abidjan ou Assinie à travers des scénarios immersifs mêlant énigmes, patrimoine et défis collaboratifs.",
      details: "Expérience signature adaptée aux groupes, familles et entreprises.",
      paxLimit: "4 pax min.",
      price: "25 000 F / pers.",
      duration: "3 h",
      image: "/assets/experiences/escape-games.png"
    },
    {
      id: "escale-mondoukou",
      indexCode: "02",
      title: "L'Escale de Mondoukou",
      category: "experiences",
      description: "Circuit immersif au cœur de la lagune Aby et du village de Mondoukou, entre traditions, nature et rencontres locales.",
      details: "Balades lagunaires, découverte culturelle et déjeuner traditionnel.",
      paxLimit: "4 pax min.",
      price: "55 000 F",
      duration: "1 journée",
      image: "/assets/experiences/escale-mondoukou.jpg"
    },
    {
      id: "operation-ehotile",
      indexCode: "02",
      title: "Opération Éhotilé",
      category: "experiences",
      description: "Une aventure en 4 étapes dans le village d'Ebouando à la découverte du patrimoine Éhotilé et de ses savoir-faire.",
      details: "Parcours immersif ponctué d'épreuves et d'animations culturelles.",
      paxLimit: "6 pax min.",
      price: "65 000 F",
      duration: "6 h",
      image: "/assets/experiences/operation-ehotile.jpg"
    },
    {
      id: "sikissa-6k",
      indexCode: "03",
      title: "Sikissa & 6K Collectif",
      category: "jeux-culturels",
      description: "Jeux de découverte et animations culturelles conçus pour les groupes et les entreprises en quête d'expériences originales.",
      details: "Format groupe avec défis, jeux d'équipe et immersion culturelle.",
      paxLimit: "8 pax min.",
      price: "20 000 F / pers.",
      duration: "3 h",
      image: "/assets/experiences/sikissa.jpg"
    },
    {
  id: "mijoterie",
  indexCode: "04",
  title: " Mijoterie",
  category: "ateliers",
  description: "Découvrez les secrets de la cuisine ivoirienne à travers un atelier immersif mêlant traditions culinaires et savoir-faire locaux.",
  details: "Préparation de recettes emblématiques et dégustation conviviale.",
  paxLimit: "4 pax min.",
  price: "30 000 F / pers.",
  duration: "3 h",
  image: "/assets/experiences/mijoterie.png"
},
{
  id: "batik",
  indexCode: "05",
  title: "Batik",
  category: "ateliers",
  description: "Initiez-vous à l'art du batik et aux techniques traditionnelles de teinture sur tissu.",
  details: "Création de motifs uniques et découverte des savoir-faire artisanaux.",
  paxLimit: "4 pax min.",
  price: "25 000 F / pers.",
  duration: "2 h",
  image: "/assets/experiences/batik.png"
},
{
  id: "infuserie",
  indexCode: "06",
  title: "Infuserie",
  category: "ateliers",
  description: "Explorez les saveurs des plantes locales à travers la préparation de tisanes et d'infusions traditionnelles.",
  details: "Dégustation et découverte des arômes et bienfaits des plantes.",
  paxLimit: "4 pax min.",
  price: "20 000 F / pers.",
  duration: "2 h",
  image: "/assets/experiences/infuserie.jpg"
},
{
  id: "cacaoterie",
  indexCode: "07",
  title: "Cacaoterie",
  category: "ateliers",
  description: "Plongez dans l'univers du cacao ivoirien et découvrez chaque étape de sa transformation, de la fève à la tablette.",
  details: "Atelier immersif avec dégustation et découverte des savoir-faire chocolatiers.",
  paxLimit: "4 pax min.",
  price: "35 000 F / pers.",
  duration: "3 h",
  image: "/assets/experiences/cacaoterie.png"
},
{
  id: "poterie",
  indexCode: "08",
  title: "Poterie",
  category: "ateliers",
  description: "Initiez-vous aux techniques traditionnelles de modelage et découvrez l'art ancestral de la poterie ivoirienne.",
  details: "Création d'objets en argile et découverte des savoir-faire artisanaux.",
  paxLimit: "4 pax min.",
  price: "30 000 F / pers.",
  duration: "3 h",
  image: "/assets/experiences/poterie.jpg"
},
{
  id: "papoterie",
  indexCode: "19",
  title: "Papoterie",
  category: "ateliers",
  description: "Exprimez votre créativité à travers la décoration et la peinture sur pots et objets en céramique dans une ambiance conviviale.",
  details: "Initiation aux techniques de peinture et personnalisation de votre création à emporter.",
  paxLimit: "4 pax min.",
  price: "25 000 F / pers.",
  duration: "2 h",
  image: "/assets/experiences/papoterie.png"
}
  ];

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(act => act.category === filter);

  const categoriesMap = [
    { id: "all", label: "TOUT" },
    { id: "experiences", label: "EXPÉRIENCES" },
     { id: "ateliers", label: "ATELIERS" },
    { id: "jeux-culturels", label: "JEUX CULTURELS" }
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
                ? "bg-[#d5a63d] border-[#d5a63d] text-white"
                : "border-[#E8E0D5] text-[#7E695D] hover:border-[#352115] hover:text-[#352115]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid displays filtered components */}
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-8" id="experiences-grid">
        {filteredActivities.map((act, idx) => (
          <motion.div
            key={act.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-[#FAF6EE] border border-[#E8E0D5] rounded-3xl hover:shadow-lg hover:border-[#9A6F4C]/40 transition-all duration-300 flex flex-col group overflow-hidden"
            id={`experience-item-${act.id}`}
          >
            {/* IMAGE - Ajoutée en haut de la carte */}
            <div className="relative w-full h-56 overflow-hidden bg-[#E8E0D5]">
              <img 
                src={act.image} 
                alt={act.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  (e.target as HTMLImageElement).src = '/images/fallback.jpg';
                }}
              />
              {/* Badge overlay */}
              <div className="absolute top-3 left-3 bg-[#352115]/80 backdrop-blur-sm text-white text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 uppercase">
                {act.category === "experiences" ? "EXPÉRIENCE" : "JEU CULTUREL"}
              </div>
              {/* Prix overlay */}
              <div className="absolute top-3 right-3 bg-[#d5a63d] text-white text-xs font-bold px-3 py-1.5">
                {act.price}
              </div>
            </div>

            {/* CONTENU */}
            <div className="p-6 flex flex-col flex-1">
              {/* Index code label */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5]/50">
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-[#9A6F4C]">
                  {act.indexCode} · {act.category.toUpperCase()}
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
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}