interface FooterProps {
  onNavigate: (view: string) => void;
  onExploreCategory?: (category: string) => void;
}

export default function Footer({ onNavigate, onExploreCategory }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#140A06] text-[#FAF6EE]/80 py-16 px-6 md:px-12 w-full border-t border-[#352115]" id="app-footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-12 border-b border-[#FAF6EE]/10">
        
        {/* Left Column Brand Block */}
        <div className="md:col-span-4 space-y-4">
          <div 
            onClick={() => onNavigate("home")} 
            className="cursor-pointer group flex flex-col w-fit"
            id="footer-logo"
          >
            <span className="font-display font-black tracking-[0.25em] text-xl text-[#FAF6EE] group-hover:text-[#9A6F4C] transition-colors duration-300">
              TRIPPIN BABI
            </span>
            <span className="text-[8px] tracking-[0.2em] text-[#9A6F4C] font-semibold uppercase mt-0.5">
              EST. ABIDJAN
            </span>
          </div>
          
          <p className="text-[#FAF6EE]/50 font-serif italic text-sm md:text-base font-light max-w-xs">
            La Côte d'Ivoire comme terrain de jeu.
          </p>
        </div>

        {/* Column 2: Experiences link navigation list */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase">
            EXPÉRIENCES
          </h4>
          <ul className="space-y-3 text-xs md:text-sm font-sans tracking-[0.05em] font-light">
            <li>
              <button 
                onClick={() => { onNavigate("experiences"); if (onExploreCategory) onExploreCategory("all"); }}
                className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
              >
                Séjours en Côte d'Ivoire
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onNavigate("experiences"); if (onExploreCategory) onExploreCategory("team-building"); }}
                className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
              >
                Escape games
              </button>
            </li>
            <li>
              <button 
                onClick={() => { onNavigate("experiences"); if (onExploreCategory) onExploreCategory("ateliers"); }}
                className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
              >
                Ateliers culturels
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate("activities")}
                className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
              >
                Activité du mois
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Corporate and Groups list */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase">
            GROUPES & ENTREPRISES
          </h4>
          <ul className="space-y-3 text-xs md:text-sm font-sans tracking-[0.05em] font-light">
            <li>
              <button 
                onClick={() => onNavigate("corporate")}
                className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
              >
                Activations team building
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate("corporate")}
                className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
              >
                Expériences sur-mesure
              </button>
            </li>
            
            <li>
              <button 
                onClick={() => onNavigate("contact")}
                className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
              >
                Nous contacter
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Row footer bar meta details */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] font-sans tracking-widest text-[#FAF6EE]/40 font-light space-y-4 md:space-y-0">
        <div>
          <span>© {currentYear} TRIPPIN BABI. TOUS DROITS RÉSERVÉS.</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => onNavigate("admin")}
            className="hover:text-[#9A6F4C] underline transition-colors cursor-pointer text-[10px] tracking-[0.15em] font-semibold"
          >
            CONSOLE ADMIN
          </button>
          <span>·</span>
          <span>MADE IN ABIDJAN</span>
        </div>
      </div>
    </footer>
  );
}
