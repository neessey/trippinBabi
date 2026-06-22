import React, { useState } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import { createTripBooking } from "../lib/firebase"; // 👈 Changé

interface BookingTripsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTripTitle?: string;  
}

export default function BookingTrips({ 
  isOpen, 
  onClose, 
  defaultTripTitle = ""  
}: BookingTripsProps) {
  // 👈 Correction : utilisation de tripTitle au lieu de trip
  const [tripTitle, setTripTitle] = useState(defaultTripTitle || "Séjour sur-mesure");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departureDate, setDepartureDate] = useState(""); // 👈 Changé de date à departureDate
  const [returnDate, setReturnDate] = useState(""); // 👈 Ajouté
  const [pax, setPax] = useState(2);
  const [accommodationType, setAccommodationType] = useState("hôtel"); // 👈 Ajouté
  const [budgetRange, setBudgetRange] = useState("moyen"); // 👈 Ajouté
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || !departureDate) {
      setErrorStatus(
        "Veuillez remplir les champs obligatoires (Nom, Email, Date de départ)."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorStatus(null);

    try {
      // 👈 Utilisation de createTripBooking avec les bons champs
      await createTripBooking({
        tripTitle,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        departureDate,
        returnDate,
        paxCount: Number(pax),
        accommodationType,
        budgetRange,
        notes,
      });

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        setDepartureDate("");
        setReturnDate("");
        setPax(2);
        setAccommodationType("hôtel");
        setBudgetRange("moyen");
        setNotes("");
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorStatus(
        "Une erreur est survenue lors de l’envoi. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative bg-[#FAF6EE] border border-[#E8E0D5] w-full max-w-lg shadow-2xl p-6 md:p-8 flex flex-col max-h-[90vh] overflow-y-auto">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#E8E0D5]/50 text-[#352115]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SUCCESS */}
        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-serif text-[#352115]">
              Demande envoyée !
            </h3>

            <p className="text-xs text-[#7E695D] max-w-sm">
              Merci pour votre demande. Nous préparons une proposition
              personnalisée pour votre voyage{" "}
              <strong>{tripTitle}</strong> et vous recontactons sous 24h.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* HEADER */}
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">
                VOYAGES PRIVÉS SUR MESURE
              </span>

              <h3 className="text-3xl font-serif text-[#352115]">
                Concevoir mon voyage
              </h3>

              <p className="text-xs text-[#7E695D]">
                Décrivez votre projet, nous créons une expérience unique pour vous.
              </p>
            </div>

            {/* ERROR */}
            {errorStatus && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errorStatus}
              </div>
            )}

            {/* TRIP SELECTOR - 👈 Correction : tripTitle au lieu de trip */}
            <div className="flex flex-col space-y-2">
              <label className="font-semibold tracking-wider text-[#352115] uppercase">
                CIRCUIT / DESTINATION *
              </label>

              <div className="flex flex-wrap gap-3 pb-3">
                {[
                  ["abidjan", "Abidjan à petits pas"],
                  ["bassam", "Grand-Bassam"],
                  ["kroumen", "Kroumen Tour"],
                  ["senoufo", "Senoufo Tour"],
                  ["yacouba", "Yacouba Tour"],
                  ["sur-mesure", "Voyage sur mesure"],
                ].map(([value, title]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTripTitle(value)} // 👈 Correction
                    className={`shrink-0 px-5 py-3 border text-sm transition-all ${
                      tripTitle === value // 👈 Correction
                        ? "bg-[#352115] text-white border-[#352115]"
                        : "bg-[#FAF6EE] border-[#E8E0D5] text-[#352115] hover:border-[#9A6F4C]"
                    }`}
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* NAME */}
            <div className="flex flex-col space-y-1">
              <label className="uppercase text-xs font-semibold text-[#352115]">
                Nom complet *
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                placeholder="Jean-Marc Koffi"
              />
            </div>

            {/* CONTACT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex flex-col space-y-1">
                <label className="uppercase text-xs font-semibold text-[#352115]">
                  Email *
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                  placeholder="email@gmail.com"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="uppercase text-xs font-semibold text-[#352115]">
                  Téléphone *
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                  placeholder="+225 ..."
                />
              </div>
            </div>

            {/* DATE + PAX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="flex flex-col space-y-1">
                <label className="uppercase text-xs font-semibold text-[#352115]">
                  Date de départ *
                </label>

                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="uppercase text-xs font-semibold text-[#352115]">
                  Date de retour
                </label>

                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                />
              </div>
            </div>

            {/* PAX & HÉBERGEMENT & BUDGET */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="uppercase text-xs font-semibold text-[#352115]">
                  Participants
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={pax}
                  onChange={(e) => setPax(Number(e.target.value))}
                  className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="uppercase text-xs font-semibold text-[#352115]">
                  Hébergement
                </label>
                <select
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                >
                  <option value="hôtel">Hôtel</option>
                  <option value="lodges">Lodges</option>
                  <option value="villa">Villa</option>
                  <option value="camping">Camping</option>
                  <option value="mixte">Mixte</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="uppercase text-xs font-semibold text-[#352115]">
                  Budget
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                >
                  <option value="économique">Économique</option>
                  <option value="moyen">Moyen</option>
                  <option value="premium">Premium</option>
                  <option value="luxe">Luxe</option>
                </select>
              </div>
            </div>

            {/* NOTES */}
            <div className="flex flex-col space-y-1">
              <label className="uppercase text-xs font-semibold text-[#352115]">
                Détails du voyage
              </label>

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border border-[#E8E0D5] p-3 bg-[#FAF6EE]"
                placeholder="Budget, préférences, allergies, style de voyage..."
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#352115] text-white py-5 text-xs tracking-[0.25em] uppercase"
            >
              {isSubmitting
                ? "Envoi..."
                : "Demander mon devis personnalisé"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}