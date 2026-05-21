import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import { SlidersHorizontal, ArrowUpRight } from 'lucide-react';

function App() {
  // État pour gérer la navigation fluide entre la galerie et l'inscription
  const [view, setView] = useState("gallery"); // "gallery" ou "register"
  
  const categories = ["Tous", "Peinture", "Sculpture", "Dessin", "Design"];
  const [activeCategory, setActiveCategory] = useState("Tous");

  // Catalogue d'œuvres d'art (style abstrait contemporain garanti sans bugs d'images)
  const artworks = [
    {
      id: 1,
      title: "Regard d'Ébène",
      artist: "Mukendi Gloire",
      type: "Peinture",
      size: "120 x 90 cm",
      price: "150 $",
      bgStyle: "bg-gradient-to-r from-zinc-900 to-stone-800"
    },
    {
      id: 2,
      title: "Symphonie Temporelle",
      artist: "Ngalula Divine",
      type: "Peinture",
      size: "80 x 80 cm",
      price: "200 $",
      bgStyle: "bg-gradient-to-r from-slate-900 to-zinc-800"
    },
    {
      id: 3,
      title: "Éveil des Formes",
      artist: "Mbuyi Jonathan",
      type: "Sculpture",
      size: "45 x 30 x 30 cm",
      price: "350 $",
      bgStyle: "bg-gradient-to-r from-zinc-800 to-zinc-600"
    },
    {
      id: 4,
      title: "Lignes de Vie",
      artist: "Kavira Sarah",
      type: "Dessin",
      size: "50 x 70 cm",
      price: "80 $",
      bgStyle: "bg-gradient-to-r from-stone-300 to-stone-100"
    },
    {
      id: 5,
      title: "Post-Modern RDC",
      artist: "Bamba Isaac",
      type: "Design",
      size: "100 x 100 cm",
      price: "120 $",
      bgStyle: "bg-gradient-to-r from-neutral-900 to-neutral-700"
    },
    {
      id: 6,
      title: "Profondeur Inconnue",
      artist: "Ngalula Divine",
      type: "Peinture",
      size: "150 x 100 cm",
      price: "280 $",
      bgStyle: "bg-gradient-to-r from-zinc-950 to-slate-900"
    }
  ];

  const filteredArtworks = activeCategory === "Tous" 
    ? artworks 
    : artworks.filter(art => art.type === activeCategory);

  // CONDITION : Si l'utilisateur demande à voir l'inscription, on court-circuite la galerie
  if (view === "register") {
    return <Register onBackToGallery={() => setView("gallery")} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-zinc-900 antialiased font-light">
      {/* On passe setView à la Navbar pour lier les actions de clics */}
      <Navbar onNavigate={setView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        
        {/* En-tête minimaliste aligné à gauche */}
        <div className="max-w-3xl mb-20">
          <p className="text-xs font-medium uppercase tracking-widest text-[#c5a880] mb-3">
            Exposition Permanente • Académie des Beaux-Arts
          </p>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-950 mb-6">
            Œuvres sélectionnées
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg leading-relaxed">
            Une archive vivante des créations contemporaines issues des ateliers de l'Académie. 
            Format rectiligne conçu pour une contemplation épurée.
          </p>
        </div>

        {/* Barre de Filtres - Ligne fine minimaliste */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-200 pb-4 mb-12 w-full">
          <div className="flex flex-wrap gap-6 items-center">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm tracking-wide transition-all cursor-pointer relative py-1 ${
                  activeCategory === cat
                    ? "text-zinc-950 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-zinc-950"
                    : "text-zinc-400 hover:text-zinc-950"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="text-xs tracking-wider text-zinc-400 font-medium uppercase">
            [{filteredArtworks.length} indexés]
          </div>
        </div>

        {/* Grille de Cartes au Format Paysage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {filteredArtworks.map((art) => (
            <div 
              key={art.id} 
              className="group flex flex-col sm:flex-row bg-white border border-zinc-200/60 p-4 rounded-lg transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.02)]"
            >
              
              {/* Partie Gauche : Le bloc visuel en format Paysage horizontal */}
              <div className="w-full sm:w-48 aspect-[3/2] sm:aspect-square md:aspect-[4/3] flex-shrink-0 rounded bg-zinc-100 overflow-hidden relative">
                <div className={`w-full h-full ${art.bgStyle} transition-transform duration-700 ease-out group-hover:scale-102`} />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider text-zinc-600 border border-zinc-200/20">
                  {art.type}
                </div>
              </div>

              {/* Partie Droite : Informations alignées de façon rectiligne */}
              <div className="flex flex-col justify-between flex-1 mt-4 sm:mt-0 sm:pl-6 py-1">
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-normal text-zinc-950 text-lg tracking-tight group-hover:text-[#c5a880] transition-colors duration-300">
                      {art.title}
                    </h4>
                    <p className="text-zinc-400 text-sm mt-0.5 font-normal">
                      par {art.artist}
                    </p>
                  </div>
                  
                  {/* Flèche icône haut-droite style galerie d'art pro */}
                  <span className="text-zinc-300 group-hover:text-zinc-950 transition-colors duration-300 mt-1">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                {/* Bas de la carte : Séparation fine rectiligne */}
                <div className="mt-6 pt-3 border-t border-zinc-100 flex justify-between items-center">
                  <span className="text-xs text-zinc-400 tracking-wide">
                    Dim. {art.size}
                  </span>
                  <span className="text-base font-medium tracking-tight text-zinc-950">
                    {art.price}
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

export default App;