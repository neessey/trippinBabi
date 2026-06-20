import { motion } from "motion/react";

const heroImage = "/src/assets/images/hero.jpg";

interface HeroProps {
  onDiscover: () => void;
  onCorporate: () => void;
}

export default function Hero({ onDiscover, onCorporate }: HeroProps) {
  return (
    <section className="relative px-6 py-12 md:px-12 md:py-20 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Typography Side */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-center space-y-8"
          id="hero-typography"
        >
          {/* Small tracked out label */}
          <div className="space-y-1">
            <span className="text-[10px] md:text-xs font-sans font-semibold tracking-[0.25em] text-[#9A6F4C] block uppercase">
              CREATING MEMORIES · ABIDJAN
            </span>
          </div>

          {/* Premium Editorial Title */}
          <h1 className="text-4xl md:text-5xl lg:text-[5.4rem] font-serif leading-[1.05] tracking-tight text-[#352115] max-w-2xl font-light">
            Vivez la CI <br /><span className="font-serif italic text-[#9A6F4C] font-normal">comme jamais</span><br />
            vous ne l'avez vue.
          </h1>

          {/* Paragraph copy */}
          <p className="text-[#7E695D] font-sans text-[15px] md:text-[17px] leading-relaxed max-w-xl font-light">
          Plongez au cœur des territoires ivoiriens à travers des expériences immersives et culturelles uniques, conçues pour valoriser les territoires ivoiriens et offrir une découverte authentique de leur patrimoine, de leurs traditions et de la richesse humaine de la Côte d’Ivoire.
          </p>

          {/* Interactive Button Calls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5 pt-4">
            <button
              onClick={onDiscover}
              className="bg-[#352115] hover:bg-[#4d3221] text-white text-[11px] font-bold tracking-[0.2em] px-8 py-5 transition-all duration-300 shadow-sm active:scale-[0.98] uppercase text-center cursor-pointer"
              id="discover-experiences-btn"
            >
              EXPÉRIENCES
            </button>
            <button
              onClick={onCorporate}
              className="border border-[#7E695D]/30 hover:border-[#352115] hover:bg-[#d5a63d] text-[#352115] text-[11px] font-bold tracking-[0.2em] px-8 py-5 transition-all duration-300 active:scale-[0.98] uppercase text-center cursor-pointer"
              id="corporate-hotels-btn"
            >
              CORPORATE
            </button>
          </div>
        </motion.div>

        {/* Right Photographic Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
          id="hero-image-wrapper"
        >
          <div className="relative w-full max-w-[430px] h-[520px] md:h-[600px] bg-[#FAF6EE] shadow-2xl shadow-[#352115]/10 overflow-hidden group">
            {/* Elegant thin frame border overlay */}
            <div className="absolute inset-4 border border-white/20 pointer-events-none z-10" />
            
            <img
              src={heroImage}
              alt="Maison coloniale de Grand-Bassam sous le soleil ivoirien"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-700 ease-out"
              id="hero-main-photo"
            />
            {/* Subtle soft warm golden ambient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-amber-900/5 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
