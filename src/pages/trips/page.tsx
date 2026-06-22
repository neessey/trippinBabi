interface PrivateTripsPageProps {
  onQuoteRequest: (tripName: string) => void;
}

export default function PrivateTripsPage({
  onQuoteRequest,
}: PrivateTripsPageProps) {
  const trips = [
    {
      title: "Abidjan à petits pas",
      duration: "1 journée",
      image: "/assets/trips/abidjan.jpg",
      description:
        "Découvrez Abidjan autrement entre artisanat, gastronomie et patrimoine.",
    },
    {
      title: "Grand-Bassam",
      duration: "1 journée",
      image: "/assets/trips/g-bassam.jpg",
      description:
        "Une parenthèse entre patrimoine UNESCO, plage et rencontres locales.",
    },
    {
      title: "Yamoussoukro Tour",
      duration: "8 Heures",
      image: "/assets/trips/yakro.jpg",
      description:
        "Decouvrez la Capitale politique, notre trésors culturels.",
    },
    {
      title: "Kroumen Tour",
      duration: "4 jours",
      image: "/assets/trips/kroumen.jpg",
      description:
        "Grand-Béréby, Monogaga et les plus belles plages du sud-ouest.",
    },
    {
      title: "Senoufo Tour",
      duration: "4 jours",
      image: "/assets/trips/senoufo.jpg",
      description:
        "Immersion dans le nord ivoirien et découverte des savoir-faire Sénoufo.",
    },
    {
      title: "Yacouba Tour",
      duration: "4 jours",
      image: "/assets/trips/yacouba.jpg",
      description:
        "Entre montagnes, cascades et forêts de l'ouest ivoirien.",
    },
    {
      title: "Akwaba Tour",
      duration: "Sur mesure",
      image: "/assets/trips/akwaba.jpg",
      description:
        "Le meilleur de la Côte d'Ivoire dans un circuit entièrement personnalisé.",
    },
  ];

  return (
    <div className="bg-[#FAF6EE] min-h-screen">

      {/* HERO PREMIUM */}
      <section className="relative h-[85vh] flex items-end px-6 md:px-16 pb-24 overflow-hidden">

        <img
          src="/assets/trips/hero.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* gradient luxe */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/90 via-[#0B0A09]/40 to-transparent" />

        <div className="relative max-w-4xl text-white">
          <span className="text-xs tracking-[0.35em] uppercase text-white/70">
            Ivorian Nomad • Private Collection
          </span>

          <h1 className="text-5xl md:text-7xl font-serif font-light mt-6 leading-[1.1]">
            Voyages privés
          </h1>

          <p className="mt-6 text-white/80 max-w-2xl text-lg leading-relaxed">
            Des expériences conçues comme des récits : intimes, authentiques,
            et entièrement personnalisées à travers la Côte d’Ivoire.
          </p>

          <button className="mt-10 border border-white/30 px-8 py-4 text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition">
            Explorer les circuits
          </button>
        </div>
      </section>

      {/* INTRO EDITORIAL */}
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-28">
        <div className="max-w-3xl">
          <span className="text-[#9A6F4C] text-xs tracking-[0.3em] uppercase">
            Voyage sur mesure
          </span>

          <h2 className="text-5xl md:text-6xl font-serif text-[#352115] mt-5 leading-tight">
            L’art de voyager autrement en Côte d’Ivoire
          </h2>

          <p className="mt-8 text-[#6F5A4E] text-lg leading-relaxed">
            Chaque itinéraire est pensé comme une immersion lente : rencontres
            locales, paysages intacts, expériences exclusives et émotions vraies.
          </p>
        </div>
      </section>

      {/* GRID PREMIUM */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {trips.map((trip) => (
            <div
              key={trip.title}
              className="group relative bg-white rounded-[28px] overflow-hidden border border-[#E8E0D5] shadow-sm hover:shadow-2xl transition duration-500"
            >

              {/* IMAGE ZOOM */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={trip.image}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                />

                {/* overlay subtil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* badge */}
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur px-4 py-2 text-[10px] tracking-[0.25em] uppercase text-[#352115]">
                  {trip.duration}
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-8">
                <h3 className="text-2xl font-serif text-[#352115] group-hover:text-[#9A6F4C] transition">
                  {trip.title}
                </h3>

                <p className="mt-4 text-sm text-[#7E695D] leading-relaxed">
                  {trip.description}
                </p>

                <button
                  onClick={() => onQuoteRequest(trip.title)}
                  className="mt-8 w-full border border-[#352115] text-[#352115] py-4 text-xs tracking-[0.25em] uppercase hover:bg-[#352115] hover:text-white transition"
                >
                  Demander un devis
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}