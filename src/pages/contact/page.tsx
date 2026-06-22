import React, { useState } from "react";
import { MapPin, Phone, Mail, Send, Check } from "lucide-react";
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = (import.meta as any).env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = (import.meta as any).env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = (import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Demande d'information générale");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !message) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Envoi via EmailJS avec les variables du template
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          title: subject,        // Correspond à {{title}}
          name: name,            // Correspond à {{name}}
          email: email,          // Correspond à {{email}}
          message: message,      // Le contenu du message
        },
        EMAILJS_PUBLIC_KEY
      );

      console.log("Email envoyé avec succès:", result);

      if (result.status === 200) {
        setIsSuccess(true);
        // Réinitialiser le formulaire
        setName("");
        setEmail("");
        setMessage("");
        setSubject("Demande d'information générale");
        // Cacher le message de succès après 5 secondes
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Erreur d'envoi d'email:", err);
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16 px-6 md:px-12 max-w-7xl mx-auto" id="contact-page">
      
      {/* Title */}
      <div className="space-y-4 mb-16 text-center md:text-left">
        <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">
          RESTER EN CONTACT
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#352115] font-light tracking-tight max-w-xl">
          Écrivez-nous pour initier votre voyage.
        </h1>
        <p className="text-sm text-[#7E695D] font-sans font-light max-w-lg">
          Que vous soyez voyageur solo, famille en quête d'immersion ou coordinateur d'agence, notre écoute est entière.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="border border-[#E8E0D5] p-6 flex items-start space-x-4 bg-[#FAF6EE]">
            <div className="p-3 bg-[#9A6F4C]/10 rounded-full text-[#9A6F4C] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-left">
              <h3 className="font-serif text-lg text-[#352115] font-medium">Bureaux d'Abidjan</h3>
              <p className="text-xs text-[#7E695D] font-sans leading-relaxed">
                Quartier de la angré, Angré <br />
                8ème Tranche, Cocody, Abidjan, Côte d'Ivoire
              </p>
            </div>
          </div>

          <div className="border border-[#E8E0D5] p-6 flex items-start space-x-4 bg-[#FAF6EE]">
            <div className="p-3 bg-[#9A6F4C]/10 rounded-full text-[#9A6F4C] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-left">
              <h3 className="font-serif text-lg text-[#352115] font-medium">Permanence téléphonique</h3>
              <p className="text-xs text-[#7E695D] font-sans">
                Lundi - Samedi : 08:00 - 18:00  <br className="mb-1" />
                <strong>+225 07 87 07 13 36</strong>
              </p>
            </div>
          </div>

          <div className="border border-[#E8E0D5] p-6 flex items-start space-x-4 bg-[#FAF6EE]">
            <div className="p-3 bg-[#9A6F4C]/10 rounded-full text-[#9A6F4C] shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 text-left">
              <h3 className="font-serif text-lg text-[#352115] font-medium">Courrier électronique</h3>
              <p className="text-xs text-[#7E695D] font-sans">
                Informations & Partenariats : <br className="mb-1" />
                <strong className="text-[#9A6F4C]">hello@trippinbabi.com</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Message Submission form */}
        <div className="lg:col-span-7 bg-[#EFEAE0] border border-[#E8E0D5] p-6 md:p-8">
          {isSuccess ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-4" id="contact-success">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-[#352115] font-light">Message acheminé !</h3>
              <p className="text-xs text-[#7E695D] font-sans max-w-xs">
                Merci pour votre correspondance. Notre équipe d'Abidjan va étudier vos questions et s'engage à vous répondre sous 12 heures.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs font-sans" id="contact-mail-form">
              <div className="space-y-1">
                <h3 className="font-serif text-lg md:text-xl text-[#352115] font-medium uppercase tracking-wide">
                  NOUS ENVOYER UN COURRIER
                </h3>
                <p className="text-[#7E695D] font-sans font-light">
                  Remplissez ce formulaire d'enregistrement et un conseiller Trippin Babi se chargera de vous recontacter d'ici peu.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase font-sans">VOTRE NOM COMPLET *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ama Touré"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">ADRESSE EMAIL DE CONTACT *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: ama.toure@yahoo.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold tracking-wider text-[#352115] uppercase font-sans">SUJET DE VOTRE VISITE</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]"
                >
                  <option value="Demande d'information générale">Demande d'information générale</option>
                  <option value="Demande de partenariat local">Demande de partenariat local ou artisan</option>
                  <option value="Recrutement / Emploi">Recrutement / Devenir guide certifié</option>
                  <option value="Presse / Média">Presse / Reportages d'influence</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold tracking-wider text-[#352115] uppercase">REDIGEZ VOTRE MESSAGE *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Écrivez vos questions ou vos commentaires ici..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] placeholder-[#7E695D]/40 resize-none"
                />
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="text-red-600 text-xs font-medium bg-red-50 p-3 border border-red-200 rounded">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#d5a63d] hover:bg-[#1C0F0A] text-white text-[11px] font-bold tracking-[0.25em] py-5 transition-colors duration-300 disabled:opacity-50 uppercase cursor-pointer flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "ENVOI EN COURS..." : "TRANSMETTRE LE MESSAGE"}</span>
              </button>

              <p className="text-[10px] text-[#7E695D]/60 text-center">
                En soumettant ce formulaire, vous acceptez que vos données soient utilisées pour vous recontacter.
              </p>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
