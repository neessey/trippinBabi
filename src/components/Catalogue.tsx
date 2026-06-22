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
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
          <motion.div
  key={cat.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: i * 0.1 }}
  onClick={() => onExploreCategory(cat.id)}
  className="
    group cursor-pointer
    border border-[#E8E0D5]
    rounded-2xl
    bg-[#FAF6EE]
    p-5
    hover:bg-[#F2ECE2]
    hover:shadow-lg
    transition-all duration-300
  "
>
  <div className="flex items-center justify-between mb-4">
    <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#9A6F4C]">
      {cat.index}
    </span>

    <span className="w-1.5 h-1.5 rounded-full bg-[#9A6F4C] opacity-0 group-hover:opacity-100 transition" />
  </div>

  <h3 className="text-xl md:text-2xl font-serif font-light text-[#352115] leading-tight group-hover:text-[#9A6F4C] transition-colors">
    {cat.title}
  </h3>

  <p className="mt-2 text-xs md:text-sm text-[#7E695D] leading-relaxed">
    {cat.description}
  </p>
</motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
