import React from 'react';
import { Palette, Menu } from 'lucide-react';

function Navbar({ onNavigate, onOpenLogin, user }) {
  
  const handleEspaceEtudiantClick = () => {
    if (user) {
      // Si l'étudiant est connecté, on l'envoie directement sur son dashboard
      onNavigate("dashboard");
    } else {
      // S'il n'est pas connecté, on l'envoie vers l'inscription
      onNavigate("register");
    }
  };

  return (
    /* CORRECTION : On remplace 'fixed top-0 left-0 z-50' par un positionnement normal + bordure subtile */
    <nav className="w-full bg-white border-b border-zinc-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate("gallery")} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="bg-zinc-900 text-white p-2 rounded-lg">
              <Palette size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950">ArtKaba</span>
          </div>

          {/* Liens Centraux */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <button 
              onClick={() => onNavigate("gallery")} 
              className="text-zinc-950 hover:text-zinc-950 transition-colors cursor-pointer bg-transparent border-none font-medium"
            >
              La Galerie
            </button>
            <a href="#" className="hover:text-zinc-950 transition-colors">Expositions</a>
            <a href="#" className="hover:text-zinc-950 transition-colors">À propos</a>
          </div>

          {/* Boutons d'actions */}
          <div className="flex items-center gap-4">
            
            {/* On affiche "Se connecter" UNIQUEMENT si personne n'est connecté */}
            {!user && (
              <button 
                onClick={onOpenLogin} 
                className="hidden sm:block text-sm font-semibold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer bg-transparent border-none"
              >
                Se connecter
              </button>
            )}
            
            {/* Ce bouton devient dynamique ! */}
            <button 
              onClick={handleEspaceEtudiantClick} 
              className="bg-[#c5a880] hover:bg-[#b3966e] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              {user ? "Mon Tableau de Bord" : "Espace Étudiant"}
            </button>
            
            <button className="md:hidden text-zinc-700 p-1 cursor-pointer bg-transparent border-none">
              <Menu size={22} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;