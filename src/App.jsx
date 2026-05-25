import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import LoginModal from "./components/LoginModal";
import { ArrowUpRight } from 'lucide-react';

function App() {
  // 1. GESTION DES ÉTATS 
  // Initialisation dynamique : On regarde d'abord si un utilisateur est déjà sauvegardé en cache
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("artkaba_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Si un utilisateur était déjà là, on va directement sur son dashboard, sinon sur la galerie
  const [view, setView] = useState(() => {
    const savedUser = localStorage.getItem("artkaba_user");
    return savedUser ? "dashboard" : "gallery";
  });

  const [activeCategory, setActiveCategory] = useState("Tous");
  const [isLoginOpen, setIsLoginOpen] = useState(false); 
  const [artworks, setArtworks] = useState([]); 
  const [loading, setLoading] = useState(true);

  const categories = ["Tous", "Peinture", "Sculpture", "Dessin", "Design"];

  // 2. EFFET : Chargement dynamique de la Galerie depuis Spring Boot
  useEffect(() => {
    if (view !== "gallery") return;

    setLoading(true);
    fetch("http://localhost:8080/api/oeuvres/all")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Impossible de récupérer la galerie.");
      })
      .then((data) => {
        setArtworks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur Galerie:", err);
        setLoading(false);
      });
  }, [view]); 

  // Fonction utilitaire pour connecter l'utilisateur et sauvegarder sa session
  const handleLoginSuccess = (etudiantData) => {
    setUser(etudiantData);
    localStorage.setItem("artkaba_user", JSON.stringify(etudiantData)); // Sauvegarde locale
    setView("dashboard");
  };

  // Fonction utilitaire pour déconnecter proprement
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("artkaba_user"); // Nettoyage du cache
    setView("gallery");
  };

  // Filtrage basé sur les catégories
  const filteredArtworks = activeCategory === "Tous" 
    ? artworks 
    : artworks.filter(art => art.categorie === activeCategory);

  // ==========================================
  // ROUTING DU DASHBOARD
  // ==========================================
  if (view === "dashboard") {
    if (!user || !user.id) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#fafafa]">
          <p className="text-sm text-zinc-400 font-light animate-pulse">Initialisation de votre atelier d'artiste...</p>
        </div>
      );
    }

    return (
      <StudentDashboard 
        user={user} 
        onLogout={handleLogout} // Utilise la nouvelle fonction de déconnexion globale
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-zinc-900 antialiased font-light">
      
      <Navbar 
        onNavigate={setView} 
        onOpenLogin={() => setIsLoginOpen(true)} 
        user={user} 
      />

      {view === "register" ? (
        <Register 
          onBackToGallery={() => setView("gallery")} 
          onRegisterSuccess={handleLoginSuccess} // Utilise la fonction de persistance
        />
      ) : (
        /* VUE GALERIE PUBLIQUE */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          {/* ... Reste de ton code de la galerie (Inchangé) ... */}
          <div className="max-w-3xl mb-20">
            <p className="text-xs font-medium uppercase tracking-widest text-[#c5a880] mb-3">
              Exposition Permanente • Académie des Beaux-Arts
            </p>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-zinc-950 mb-6">
              Œuvres sélectionnées
            </h2>
            <p className="text-zinc-500 text-base sm:text-lg leading-relaxed">
              Une archive vivante des créations contemporaines issues des ateliers de l'Académie. 
            </p>
          </div>

          {/* Filtres */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-zinc-200 pb-4 mb-12 w-full">
            <div className="flex flex-wrap gap-6 items-center">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm tracking-wide transition-all cursor-pointer relative py-1 ${
                    activeCategory === cat ? "text-zinc-950 font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-zinc-950" : "text-zinc-400 hover:text-zinc-950"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="text-xs tracking-wider text-zinc-400 font-medium uppercase">[{filteredArtworks.length} indexés]</div>
          </div>

          {/* Grille de cartes avec affichage des vraies images */}
          {loading ? (
            <div className="text-center py-20 text-zinc-400 text-sm">
              Mise en place de la galerie d'art...
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 text-sm">
              Aucune œuvre disponible dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {filteredArtworks.map((art) => (
                <div 
                  key={art.id} 
                  className="group flex flex-col sm:flex-row bg-white border border-zinc-200/60 p-4 rounded-lg transition-all duration-300 hover:border-zinc-300 hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.02)]"
                >
                  {/* CORRECTION ZONE IMAGE : On passe d'un dégradé CSS à une vraie image */}
                  <div className="w-full sm:w-48 aspect-[3/2] sm:aspect-square md:aspect-[4/3] flex-shrink-0 rounded bg-zinc-50 overflow-hidden relative border border-zinc-100">
                    {art.imageUrl ? (
                      <img 
                        src={`http://localhost:8080${art.imageUrl}`} 
                        alt={art.titre}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                          // Remplacement de secours si l'image physique est introuvable sur le disque dur
                          e.target.onerror = null; 
                          e.target.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=500&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      // Fallback si le champ imageUrl est vide ou null en base de données
                      <div className="w-full h-full bg-gradient-to-r from-zinc-100 to-zinc-200 flex items-center justify-center text-zinc-400">
                        <span className="text-xs font-normal">Aucun visuel</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider text-zinc-600 border border-zinc-200/20">
                      {art.categorie}
                    </div>
                  </div>

                  {/* Reste des informations de la carte */}
                  <div className="flex flex-col justify-between flex-1 mt-4 sm:mt-0 sm:pl-6 py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-normal text-zinc-950 text-lg tracking-tight group-hover:text-[#c5a880] transition-colors duration-300">
                          {art.titre}
                        </h4>
                        <p className="text-zinc-400 text-sm mt-0.5 font-normal">
                          par {art.etudiant?.nom || "Artiste Anonyme"}
                        </p>
                      </div>
                      <span className="text-zinc-300 group-hover:text-zinc-950 transition-colors duration-300 mt-1">
                        <ArrowUpRight size={18} />
                      </span>
                    </div>

                    <div className="mt-6 pt-3 border-t border-zinc-100 flex justify-between items-center">
                      <span className="text-xs text-zinc-400 tracking-wide">
                        Dim. {art.dimensions}
                      </span>
                      <span className="text-base font-medium tracking-tight text-zinc-950">
                        {art.prix}
                      </span>
                    </div>
                  </div>
                </div>  
              ))}
            </div>
          )}
        </main>
      )}

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} // Utilise la fonction de persistance
      />
    </div>
  );
}

export default App;