import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import LoginModal from "./components/LoginModal";
import { SlidersHorizontal, ArrowUpRight } from 'lucide-react';

function App() {
  // 1. GESTION DES ÉTATS (Mis à jour avec isLoginOpen)
  const [view, setView] = useState("gallery"); // "gallery", "register" ou "dashboard"
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [user, setUser] = useState(null); // Infos de l'étudiant connecté via Spring Boot
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Gère l'affichage de la modale de login

  const categories = ["Tous", "Peinture", "Sculpture", "Dessin", "Design"];

  // Catalogue d'œuvres d'art
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

  // 2. CONDITION DE ROUTING : Écran Inscription
  if (view === "register") {
    return (
      <Register 
        onBackToGallery={() => setView("gallery")} 
        onRegisterSuccess={(data) => {
          setUser(data);       // On sauvegarde le profil réel retourné par Spring Boot
          setView("dashboard"); // On l'envoie sur son espace
        }} 
      />
    );
  }

  // 3. CONDITION DE ROUTING : Dashboard Étudiant Dynamique
  if (view === "dashboard") {
     return (
       <StudentDashboard 
         user={user} 
         onLogout={() => {
           setUser(null);      // On efface la session locale
           setView("gallery"); // Retour à la galerie publique
         }} 
       />
     );
   }

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-zinc-900 antialiased font-light">
      
      {/* 4. NAVBAR CORRIGÉE : On passe les deux fonctions requises */}
      <Navbar 
        onNavigate={setView} 
        onOpenLogin={() => setIsLoginOpen(true)} 
        user={user} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
        
        {/* En-tête minimaliste */}
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

        {/* Barre de Filtres */}
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
              {/* Partie Gauche : Visuel */}
              <div className="w-full sm:w-48 aspect-[3/2] sm:aspect-square md:aspect-[4/3] flex-shrink-0 rounded bg-zinc-100 overflow-hidden relative">
                <div className={`w-full h-full ${art.bgStyle} transition-transform duration-700 ease-out group-hover:scale-102`} />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider text-zinc-600 border border-zinc-200/20">
                  {art.type}
                </div>
              </div>

              {/* Partie Droite : Infos */}
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
                  <span className="text-zinc-300 group-hover:text-zinc-950 transition-colors duration-300 mt-1">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

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

        {/* 5. MODALE DE LOGIN (Utilise l'état isLoginOpen correctement déclaré) */}
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)} 
          onLoginSuccess={(etudiantConnecte) => {
            setUser(etudiantConnecte); // Sauvegarde l'étudiant connecté
            setView("dashboard");       // Propulse sur son espace
          }} 
        />
      </main>
    </div>
  );
}

export default App;