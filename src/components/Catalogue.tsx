import { motion } from "motion/react";

interface CatalogueProps {
  onExploreCategory: (category: string) => void;
  onExploreAll: () => void;
}

export default function Catalogue({ onExploreCategory, onExploreAll }: CatalogueProps) {
const categories = [
  {
    index: "N1 - Signature",
    title: "Escape games & Chasses urbaines",
    description: "Grand-Bassam · Abidjan · Assinie",
    id: "eg-signature"
  },
  {
    index: "N2 - Expériences ancrées",
    title: "L'Escale de Mondoukou",
    description: "Circuit immersif · Lagune Aby",
    id: "escale-mondoukou"
  },
  {
    index: "N2 - Expériences ancrées",
    title: "Opération Éhotilé",
    description: "4 étapes · Village Ebouando",
    id: "operation-ehotile"
  },
  {
    index: "N3 - Jeux culturels",
    title: "Sikissa & 6K Collectif",
    description: "Jeux de découverte · Format groupe",
    id: "sikissa-6k"
  }
];

  return (
    <section className="bg-[#FAF6EE] py-20 px-6 md:px-12 w-full" id="catalogue-section">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Header Row matching photo strictly */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8E0D5]/60">
          <div className="space-y-3">
            <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">
              LE CATALOGUE
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#352115] font-light tracking-tight max-w-xl">
              Quatre façons de rencontrer la Côte d'Ivoire.
            </h2>
          </div>
          
          <div>
            <button
              onClick={onExploreAll}
              className="text-xs font-bold tracking-[0.25em] text-[#352115] border-b-2 border-[#352115] pb-1 hover:text-[#9A6F4C] hover:border-[#9A6F4C] transition-all duration-300 uppercase cursor-pointer"
              id="view-all-experiences-link"
            >
              TOUTES LES EXPÉRIENCES →
            </button>
          </div>
        </div>

        {/* 4 Cards Grid - exactly styled layout */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
className="flex flex-col justify-between p-8 md:p-10 border border-[#E8E0D5] rounded-3xl bg-[#FAF6EE] hover:bg-[#EFEAE0]/40 hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[320px] group relative overflow-hidden"
              id={`category-card-${cat.id}`}
            >
              {/* Index counter top header */}
              <div className="flex justify-between items-center z-10">
                <span className="text-[11px] font-sans font-bold text-[#9A6F4C] tracking-[0.15em]">
                  {cat.index}
                </span>
                
                {/* Visual hover graphic indicator */}
                <span className="w-1.5 h-1.5 rounded-full bg-[#9A6F4C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Main Typography content */}
              <div className="space-y-3 z-10">
                <h3 className="text-2xl md:text-3xl font-serif text-[#352115] group-hover:text-[#9A6F4C] transition-colors duration-300 font-light">
                  {cat.title}
                </h3>
                <p className="text-[#7E695D] font-sans text-xs md:text-sm leading-relaxed font-light">
                  {cat.description}
                </p>
              </div>

              {/* Custom background color slide up item */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#9A6F4C]/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
