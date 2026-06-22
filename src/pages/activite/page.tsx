import { motion } from "motion/react";
import { MonthlyActivity } from "../../types";

const defaultCocoaImage = "/assets/cacao.png";

interface ActiviteDuMoisProps {
  activity: MonthlyActivity;
  onBook: () => void;
  onViewProgram: () => void;
}

export default function ActiviteDuMois({ activity, onBook, onViewProgram }: ActiviteDuMoisProps) {
  // Graceful fallbacks for robust runtime rendering
  const textTitle = activity?.title || "La Cacaoterie —";
  const italicTitle = activity?.italicTitle || "de la fève à la tablette.";
  const description = activity?.description || "Une matinée immersive auprès d'un maître chocolatier ivoirien.";
  const duration = activity?.duration || "3 h";
  const groupSize = activity?.groupSize || "5 pax min.";
  const price = activity?.price || "45 000 F";
  const monthDate = activity?.monthDate || "JANVIER 2026";
  const imageUrl = activity?.imageUrl || defaultCocoaImage;

  return (
    <section className="bg-[#EFEAE0] py-16 px-6 md:px-12 w-full border-t border-[#E8E0D5]" id="activite-du-mois-section">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Large Action Close-up Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 order-2 lg:order-1 flex justify-center lg:justify-start"
          id="activite-image-col"
        >
          <div className="relative w-full max-w-[540px] aspect-[4/3] bg-[#E8E0D5] overflow-hidden shadow-xl shadow-stone-800/5 group">
            {/* Elegant inner frame */}
            <div className="absolute inset-4 border border-white/10 pointer-events-none z-10" />
            <img 
              src={imageUrl} 
              alt="Artisan Chocolatier" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                // If remote uploaded URL fails or gets blocked, fallback to generated local image
                e.currentTarget.src = defaultCocoaImage;
              }}
              id="activite-photo"
            />
          </div>
        </motion.div>

        {/* Right Side: Detailed Info Panel matching photo strictly */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center space-y-6 md:space-y-8"
          id="activite-content-col"
        >
          {/* Section Indicator Line */}
          <div className="flex items-center space-x-4">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#7E695D] uppercase shrink-0">
              ACTIVITÉ DU MOIS
            </span>
            <div className="h-[1px] bg-[#7E695D]/30 w-16 md:w-24 shrink-0" />
            <span className="text-[10px] md:text-xs font-sans font-semibold tracking-[0.2em] text-[#7E695D]/80 uppercase">
              {monthDate}
            </span>
          </div>

          {/* Heading Content */}
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl lg:text-[2.85rem] font-serif leading-[1.12] tracking-tight text-[#352115]">
              {textTitle} <br />
              <span className="font-serif italic text-[#9A6F4C] font-normal">{italicTitle}</span>
            </h2>
          </div>

          {/* Activity Description */}
          <p className="text-[#7E695D] font-sans text-sm md:text-base leading-relaxed font-light max-w-xl">
            {description}
          </p>

          {/* Horizontally aligned details list mirroring exactly */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-[#E8E0D5] max-w-xl" id="activite-spec-table">
            <div className="flex flex-col space-y-1">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7E695D] uppercase">DURÉE</span>
              <span className="text-lg md:text-xl font-serif font-medium text-[#352115]">{duration}</span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7E695D] uppercase">GROUPE</span>
              <span className="text-lg md:text-xl font-serif font-medium text-[#352115]">{groupSize}</span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#7E695D] uppercase">DÈS</span>
              <span className="text-lg md:text-xl font-serif font-medium text-[#9A6F4C]">{price}</span>
            </div>
          </div>

          {/* Action buttons matching exact size, shape, and positions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-2">
            <button
              onClick={onBook}
              className="bg-[#352115] hover:bg-[#4d3221] text-white text-[11px] font-bold tracking-[0.2em] px-8 py-5 transition-all duration-300 shadow-sm active:scale-[0.98] uppercase cursor-pointer"
              id="reserve-activity-btn"
            >
              RÉSERVER MA PLACE
            </button>
            <button
              onClick={onViewProgram}
              className="text-[#352115] text-[10px] md:text-xs font-bold tracking-[0.22em] border-b border-[#352115]/30 hover:border-[#352115] pb-1 transition-all duration-300 uppercase cursor-pointer text-center sm:text-left self-center sm:self-auto"
              id="view-program-btn"
            >
              VOIR LE PROGRAMME COMPLET →
            </button>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
