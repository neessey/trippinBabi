import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Sparkles, Building, Landmark, Mail, ClipboardCheck } from "lucide-react";
import { createContactRequest } from "../../lib/firebase";
import { ActivityCard } from "@/src/types";

const corporateActivities: ActivityCard[] = [
  {
    id: "escape-city",
    indexCode: "01",
    title: "Escape City",
    category: "team-building",
    description:
      "Aventures grandeur nature à Abidjan, Grand-Bassam ou Grand-Béréby mêlant énigmes, patrimoine et défis collaboratifs.",
    details: "Format idéal pour les entreprises et groupes.",
    paxLimit: "5 pers. min.",
    price: "Sur devis",
    duration: "7 h",
    image: "/assets/corporate/escape.jpg",
  },
  {
    id: "sisterhood",
    indexCode: "02",
    title: "Sisterhood",
    category: "team-building",
    description:
      "Des soirées conviviales pour favoriser les échanges, découvrir des ateliers et mettre en valeur l'artisanat local.",
    details: "Animation privée ou groupe constitué.",
    paxLimit: "5 pers. min.",
    price: "Sur devis",
    duration: "4 h",
    image: "/assets/corporate/sisterhood.jpeg",
  },
  {
    id: "trippinchill",
    indexCode: "03",
    title: "TrippinChill",
    category: "team-building",
    description:
      "Jeux, quiz, musique et animations pour créer des souvenirs entre collègues, partenaires ou amis.",
    details: "Ambiance décontractée et conviviale.",
    paxLimit: "5 pers. min.",
    price: "Sur devis",
    duration: "4 h",
    image: "/assets/corporate/trippinchill.jpeg",
  },
  {
    id: "trippinbbq",
    indexCode: "04",
    title: "TrippinBBQ",
    category: "team-building",
    description:
      "Une journée complète mêlant barbecue, jeux collectifs et activités de cohésion d'équipe.",
    details: "Parfait pour les grandes équipes.",
    paxLimit: "20 pers. min.",
    price: "Sur devis",
    duration: "6 h",
    image: "/assets/corporate/trippinbbq.jpg",
  },
];

export default function CorporatePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [employeesCount, setEmployeesCount] = useState("10-30");
  const [eventTopic, setEventTopic] = useState("Team Building");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  async function handleEstimateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      await createContactRequest({
        name,
        email,
        company,
        subject: `Demande Devis Groupe - ${eventTopic} (${employeesCount} pers.)`,
        message: `Entreprise: ${company || "Non spécifiée"}\nTaille Groupe: ${employeesCount}\nType d'Événement: ${eventTopic}\nMessage:\n${message}`
      });
      setIsSuccess(true);
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-16" id="corporate-page">
      
      {/* Editorial Title Header */}
        <div className="space-y-6 ">
  <div className="space-y-3 max-w-2xl">
    <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">
      TEAM BUILDING · SOIRÉES · ÉVÉNEMENTS
    </span>

    <h1 className="text-4xl md:text-5xl font-serif text-[#352115] font-light tracking-tight">
          La Côte d'Ivoire comme terrain de jeu corporatif.
        </h1>
        <p className="text-sm text-[#7E695D] font-sans font-light leading-relaxed">
          Nous concevons des aventures immersives sur mesure pour reconnecter vos équipes, célébrer vos réussites et immerger vos partenaires internationaux dans la quintessence de la culture ivoirienne.
        </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {corporateActivities.map((act, idx) => (
      <motion.div
        key={act.id}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: idx * 0.1 }}
        className="bg-[#FAF6EE] border border-[#E8E0D5] rounded-3xl overflow-hidden hover:border-[#9A6F4C]/40 hover:shadow-lg transition-all duration-300 group"
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={act.image}
            alt={act.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />

          <div className="absolute top-4 right-4 bg-[#d5a63d] text-white text-xs font-bold px-3 py-1">
            {act.price}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-7 space-y-5">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#9A6F4C] uppercase">
            {act.indexCode} · {act.category}
          </span>

          <h3 className="text-2xl font-serif text-[#352115] group-hover:text-[#9A6F4C] transition-colors">
            {act.title}
          </h3>

          <p className="text-sm text-[#7E695D] leading-relaxed">
            {act.description}
          </p>

          <div className="flex justify-between border-t border-[#E8E0D5] pt-4 text-xs text-[#7E695D]">
            <span>
              Durée : <strong>{act.duration}</strong>
            </span>

            <span>
              Groupe : <strong>{act.paxLimit}</strong>
            </span>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</div>

      {/* Quote request layout split block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 rounded-2xl bg-[#d5a63d] border border-[#E8E0D5] p-8 md:p-12 items-start" id="quote-block">
        
        {/* Left Side Quote Promo */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-sans font-outline tracking-[0.2em] text-[#9A6F4C] font-semibold uppercase block">
            DEVIS EXPRESS SOUS 24H
          </span>
          <h2 className="text-3xl font-serif text-[#352115] font-light tracking-tight leading-tight">
            Prêt(e)s à façonner un instant mémorable ?
          </h2>
          <p className="text-xs md:text-sm text-[#7E695D] font-sans font-light leading-relaxed">
            Notre architecte d'événements étudie votre cahier des charges pour concevoir un programme de voyage, d'escape game historique ou d'atelier adapté à vos objectifs d'affaires et de cohésion.
          </p>
          
          <div className="space-y-3 pt-4">
            <h4 className="text-[10px] font-sans font-bold text-[#352115] tracking-[0.15em] uppercase">CHARTE DE QUALITÉ :</h4>
            <ul className="space-y-2 text-[11px] font-sans text-[#7E695D]">
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Navettes privatisées climatisées de standing.</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interlocuteur local unique pour simplifier l'organisation.</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Restauration 100% responsable d'approche locale.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side Intake Form */}
        <div className="lg:col-span-7 bg-[#352115] rounded-2xl p-6 md:p-8 border border-[#E8E0D5]/60 shadow-sm">
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4" id="corporate-success">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-[#FAF6EE] font-light">Demande d'estimation envoyée</h3>
              <p className="text-xs text-[#7E695D] font-sans font-light max-w-sm">
                Votre programmation a été enregistrée avec succès. Notre chef de projet voyages va vous transmettre une proposition d'estimation chiffrée par courriel.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEstimateSubmit} className="space-y-5 text-xs font-sans">
              <h3 className="text-base font-semibold tracking-wider text-[#FAF6EE] border-b border-[#E8E0D5] pb-2 uppercase">
                FORMULAIRE D'IMMERSION SUR MESURE
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">VOTRE NOM *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kouamé N'Guessan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">EMAIL PRO *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: direction@entreprise.ci"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase font-sans">ENTREPRISE / GROUPE</label>
                  <input
                    type="text"
                    placeholder="Ex: Orange Côte d'Ivoire"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase font-sans">TAILLE DU GROUPE SOUHAITÉE</label>
                  <select
                    value={employeesCount}
                    onChange={(e) => setEmployeesCount(e.target.value)}
                    className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]"
                  >
                    <option value="5-10 personnes">5 à 10 personnes</option>
                    <option value="10-30 personnes">10 à 30 personnes</option>
                    <option value="30-50 personnes">30 à 50 personnes</option>
                    <option value="Plus de 50">Plus de 50 personnes</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold tracking-wider text-[#352115] uppercase">TYPE D'ÉVÉNEMENT</label>
                <select
                  value={eventTopic}
                  onChange={(e) => setEventTopic(e.target.value)}
                  className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]"
                >
                  <option value="Team Building">Matinée Renforcement (Team Building)</option>
                  <option value="Séminaire">Séminaire Cadres avec hébergement d'exception</option>
                  <option value="Immersion Clients">Immersion VIP d'Affaires d'artisans locaux</option>
                  <option value="Privatisation Totale">Privatisation Totale du Voyage</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold tracking-wider text-[#352115] uppercase">DÉTAILLEZ VOTRE PROJET ET CALENDRIER *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ex: Nous souhaitons organiser une journée de cohésion d'équipe mi-septembre combinant chasse au trésor à Grand-Bassam et déjeuner plage pour environ 25 de nos collaborateurs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FAF6EE] hover:bg-[#1C0F0A] text-[#352115] text-[11px] font-bold tracking-[0.25em] py-5 transition-colors duration-300 disabled:opacity-50 uppercase cursor-pointer"
              >
                {isSubmitting ? "TRANSMISSION..." : "OBTENIR MON DEVIS"}
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
