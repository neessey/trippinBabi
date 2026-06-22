interface FooterProps {
  onNavigate: (view: string) => void;
  onExploreCategory?: (category: string) => void;
}

export default function Footer({ onNavigate, onExploreCategory }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#140A06] text-[#FAF6EE]/80 border-t border-[#352115]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-14 pb-16 border-b border-[#FAF6EE]/10">

          {/* Brand */}
<div className="md:col-span-4  md:-mt-10">
              <div
              onClick={() => onNavigate("home")}
              className="cursor-pointer w-fit group "
            >
              <img
    src="/assets/logo1.png"
    alt="TRIPPIN BABI"
    className="h-32 md:h-40 w-auto object-contain"
  />
            </div>

            <p className="text-sm leading-relaxed text-[#FAF6EE]/50 max-w-sm">
              La Côte d'Ivoire regorge de traditions, de savoir-faire et
              d'histoires à transmettre. Nos expériences sont pensées pour
              révéler toute la richesse du patrimoine ivoirien.
            </p>
          </div>

          {/* Explorer */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[11px] tracking-[0.25em] text-[#9A6F4C] font-bold uppercase">
              Explorer
            </h4>

            <ul className="space-y-4 text-sm">
              <li>
                <button
                  onClick={() => {
                    onNavigate("experiences");
                    onExploreCategory?.("all");
                  }}
                  className="hover:text-white transition"
                >
                  Toutes les expériences
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    onNavigate("experiences");
                    onExploreCategory?.("ateliers");
                  }}
                  className="hover:text-white transition"
                >
                  Ateliers immersifs
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    onNavigate("experiences");
                    onExploreCategory?.("jeux-culturels");
                  }}
                  className="hover:text-white transition"
                >
                  Jeux culturels
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate("activities")}
                  className="hover:text-white transition"
                >
                  Activité du mois
                </button>
              </li>
            </ul>
          </div>

          {/* Entreprises */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-[11px] tracking-[0.25em] text-[#9A6F4C] font-bold uppercase">
              Groupes & Entreprises
            </h4>

            <ul className="space-y-4 text-sm">
              <li>
                <button
                  onClick={() => onNavigate("corporate")}
                  className="hover:text-white transition"
                >
                  Team Building
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate("corporate")}
                  className="hover:text-white transition"
                >
                  Expériences sur mesure
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate("corporate")}
                  className="hover:text-white transition"
                >
                  Activations de marque
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2 space-y-5">
            <h4 className="text-[11px] tracking-[0.25em] text-[#9A6F4C] font-bold uppercase">
              Contact
            </h4>

            <div className="space-y-4 text-sm text-[#FAF6EE]/60">
              <p>Abidjan, Côte d'Ivoire</p>

              <a
                href="mailto:hello@trippinbabi.com"
                className="block hover:text-white transition"
              >
                hello@trippinbabi.com
              </a>

              <button
                onClick={() => onNavigate("contact")}
                className="hover:text-white transition"
              >
                Nous contacter
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.18em] text-[#FAF6EE]/40">

          <span>
            © {currentYear} TRIPPIN BABI — TOUS DROITS RÉSERVÉS
          </span>

          <div className="flex items-center gap-6 uppercase">
            <span>Made in Abidjan</span>
          </div>

        </div>
      </div>
    </footer>
  );
}