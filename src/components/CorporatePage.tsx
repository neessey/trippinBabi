import React, { useState } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Sparkles, Building, Landmark, Mail, ClipboardCheck } from "lucide-react";
import { createContactRequest } from "../lib/firebase";

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

  const features = [
    {
      icon: Building,
      title: "Team Building d'Exception",
      desc: "Créer de la cohésion autour d'ateliers de poterie, chasses au trésor côtières, ou escapades nautiques privatisées à Assinie.",
      image: "/assets/team-building.jpg" 
    },
    {
      icon: Landmark,
      title: "Séminaires Culturels",
      desc: "Réunissez vos cadres et investisseurs dans des décors coloniaux authentiques de Grand-Bassam ou des havres discrets d'Abidjan.",
      image: "/assets/seminaires-culturels.jpg"
    },
    {
      icon: Sparkles,
      title: "Activations Clé en Main",
      desc: "De la logistique sécurisée en 4x4 de luxe à la restauration gastronomique par de grands chefs de cuisine ivoirienne.",
      image: "/assets/activations-cleen-main.jpg"
    }
  ];

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-16" id="corporate-page">
      
      {/* Editorial Title Header */}
      <div className="space-y-4 text-center md:text-left max-w-2xl">
        <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">
          OFFRES POUR LES ENTREPRISES
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#352115] font-light tracking-tight">
          La Côte d'Ivoire comme terrain de jeu corporatif.
        </h1>
        <p className="text-sm text-[#7E695D] font-sans font-light leading-relaxed">
          Nous concevons des aventures immersives sur mesure pour reconnecter vos équipes, célébrer vos réussites et immerger vos partenaires internationaux dans la quintessence de la culture ivoirienne.
        </p>
      </div>

      {/* Tripping elements grid avec images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 " id="corporate-features-grid">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="border border-[#E8E0D5] bg-[#FAF6EE] rounded-3xl text-left hover:border-[#9A6F4C] transition-all duration-300 overflow-hidden"
            >
              {/* Image en haut */}
              <div className="relative w-full h-48 overflow-hidden bg-[#E8E0D5]">
                <img 
                  src={feat.image} 
                  alt={feat.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy" // Pour optimiser le chargement
                />
              </div>
              
              {/* Contenu existant */}
              <div className="p-8 ">
                <div className="w-12 h-12 bg-[#9A6F4C]/10 border border-[#9A6F4C]/20 rounded-full flex items-center justify-center text-[#9A6F4C] mb-6">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-[#352115] font-normal mb-3">
                  {feat.title}
                </h3>
                <p className="text-xs md:text-sm text-[#7E695D] font-sans font-light leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quote request layout split block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 rounded-2xl bg-[#d5a63d] border border-[#E8E0D5] p-8 md:p-12 items-start" id="quote-block">
        
        {/* Left Side Quote Promo */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-sans font-outline tracking-[0.2em] text-[#9A6F4C] font-semibold uppercase block">
            DEVIS EXPRESS SOUS 24H
          </span>
          <h2 className="text-3xl font-serif text-[#352115] font-light tracking-tight leading-tight">
            Prêt à façonner un instant mémorable ?
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