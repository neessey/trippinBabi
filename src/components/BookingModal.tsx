import React, { useState } from "react";
import { X, Calendar, Check, AlertCircle } from "lucide-react";
import { createBooking } from "../lib/firebase";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultActivityTitle?: string;
}

export default function BookingModal({ isOpen, onClose, defaultActivityTitle = "" }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState(2);
  const [notes, setNotes] = useState("");
  const [activity, setActivity] = useState(defaultActivityTitle || "La Cacaoterie");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !date) {
      setErrorStatus("Veuillez remplir les champs obligatoires (Nom, Email, Date).");
      return;
    }

    setIsSubmitting(true);
    setErrorStatus(null);

    try {
      await createBooking({
        activityTitle: activity,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        bookingDate: date,
        paxCount: Number(pax),
        notes: notes
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        // Reset and close
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setPax(2);
        setNotes("");
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setErrorStatus("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" id="booking-modal-overlay">
      <div className="relative bg-[#FAF6EE] border border-[#E8E0D5] w-full max-w-lg shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto" id="booking-modal-body">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#E8E0D5]/50 text-[#352115] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4" id="booking-success-message">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-[#352115] font-light">
              Demande enregistrée !
            </h3>
            <p className="text-xs text-[#7E695D] font-sans tracking-wide max-w-sm">
              Merci pour votre intérêt. Notre équipe va analyser votre demande d'immersion pour <strong>{activity}</strong> et vous contactera d'ici 24 heures pour confirmer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" id="booking-form">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">
                IMMERSION LOCALE
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-[#352115] font-light tracking-tight">
                Planifier mon expérience
              </h3>
              <p className="text-xs text-[#7E695D] font-sans font-light">
                Remplissez ce court formulaire pour bloquer votre date. Aucun paiement immédiat n'est requis.
              </p>
            </div>

            {errorStatus && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center space-x-2" id="booking-form-error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorStatus}</span>
              </div>
            )}

            <div className="space-y-4 text-xs font-sans">
              
              {/* Activity Picker */}
              <div className="flex flex-col space-y-1">
                <label className="font-semibold tracking-wider text-[#352115] uppercase">EXPÉRIENCE CHOISIE *</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="bg-[#FAF6EE] border border-[#E8E0D5] p-3 text-[#352115] focus:outline-none focus:border-[#9A6F4C] text-sm"
                >
                  <option value="La Cacaoterie">La Cacaoterie — de la fève à la tablette</option>
                  <option value="Atelier Cuisine Ivoirenne">Atelier Cuisine Ivoirenne — Secrets de Mijoterie</option>
                  <option value="Atelier Batik">Atelier Batik — Teinture traditionnelle</option>
                  <option value="Atelier Boiserie">Atelier Boiserie — Sculpture sur bois noble</option>
                  <option value="Atelier Infuserie">Atelier Infuserie — Tisanes locales et arômes</option>
                  <option value="Circuit historique Grand-Bassam">Circuit historique Grand-Bassam — Cité coloniale</option>
                  <option value="Journée Assinie">Journée Assinie — Lisière entre lagune et mer</option>
                  <option value="Team building Escape City">Team building Escape City — Sur la piste d'Abidjan</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="flex flex-col space-y-1">
                <label className="font-semibold tracking-wider text-[#352115] uppercase">VOTRE NOM COMPLET *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean-Marc Koffi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#FAF6EE] border border-[#E8E0D5] p-3 text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                />
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">E-MAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: koffi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#FAF6EE] border border-[#E8E0D5] p-3 text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase font-sans">TÉLÉPHONE</label>
                  <input
                    type="tel"
                    placeholder="Ex: +225 07 00 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#FAF6EE] border border-[#E8E0D5] p-3 text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                  />
                </div>
              </div>

              {/* Meta Row (Date & Participants) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">DATE DE VISITE SOUHAITÉE *</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#FAF6EE] border border-[#E8E0D5] p-3 text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">PARTICIPANTS SOUHAITÉS</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={pax}
                    onChange={(e) => setPax(Number(e.target.value))}
                    className="bg-[#FAF6EE] border border-[#E8E0D5] p-3 text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col space-y-1">
                <label className="font-semibold tracking-wider text-[#352115] uppercase">COMMENTAIRES OU COORDONNÉES SPÉCIALES</label>
                <textarea
                  rows={3}
                  placeholder="Allergies, logistique de transport, régimes alimentaires, langues..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-[#FAF6EE] border border-[#E8E0D5] p-3 text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40 resize-none"
                />
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#352115] hover:bg-[#1C0F0A] text-white text-[11px] font-bold tracking-[0.25em] py-5 transition-all duration-300 disabled:opacity-50 uppercase cursor-pointer text-center"
              >
                {isSubmitting ? "ENVOI..." : "CONFIRMER MA RÉSERVATION"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
