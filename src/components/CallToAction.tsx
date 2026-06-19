import { motion } from "motion/react";

interface CallToActionProps {
  onPlanTrip: () => void;
  onGroupQuote: () => void;
}

export default function CallToAction({ onPlanTrip, onGroupQuote }: CallToActionProps) {
  return (
    <section className="bg-[#C4A44D] text-[#352115] relative py-20 px-6 md:px-12 w-full overflow-hidden" id="cta-section">
      {/* Dynamic line vector art background matching the photo */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 1000 1000" className="w-[150%] h-[150%] text-[#352115]">
          <circle cx="500" cy="500" r="300" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="500" cy="500" r="600" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <path d="M0,500 L1000,500" stroke="currentColor" strokeWidth="0.5" />
          <path d="M500,0 L500,1000" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Circle point graphic in middle left */}
      <div className="absolute left-10 md:left-24 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#352115]/60 block" />

      <div className="max-w-4xl mx-auto relative text-center space-y-10 z-10">
        
        {/* Animated Headline Pair */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-1"
        >
          <h2 className="text-3xl md:text-5xl lg:text-[4.2rem] font-serif leading-[1.1] text-[#352115] tracking-tight font-light">
            Prête à jouer
          </h2>
          <h2 className="text-3.5xl md:text-5.5xl lg:text-[4.5rem] font-serif italic text-[#352115] font-light leading-none">
            sur notre terrain ?
          </h2>
        </motion.div>

        {/* Buttons in Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4 max-w-xl mx-auto"
        >
          <button
            onClick={onPlanTrip}
            className="bg-[#352115] hover:bg-[#1C0F0A] text-white text-[10px] md:text-xs font-bold tracking-[0.22em] px-8 py-5 transition-all duration-300 shadow-md active:scale-[0.98] uppercase text-center cursor-pointer"
            id="cta-plan-trip-btn"
          >
            PLANIFIER MON SÉJOUR
          </button>
          
          <button
            onClick={onGroupQuote}
            className="border border-[#352115] hover:bg-[#352115]/10 text-[#352115] text-[10px] md:text-xs font-bold tracking-[0.22em] px-8 py-5 transition-all duration-300 active:scale-[0.98] uppercase text-center cursor-pointer"
            id="cta-group-quote-btn"
          >
            DEMANDER UN DEVIS GROUPE
          </button>
        </motion.div>

      </div>
    </section>
  );
}
