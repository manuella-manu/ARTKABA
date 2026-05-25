import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Image, MessageSquare, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import AddArtworkModal from './AddArtworkModal';

function StudentDashboard({ onLogout, user }) {
  // L'état initial dépend du profil utilisateur reçu de Spring Boot
  const [isActivated, setIsActivated] = useState(user?.isActivated || false);
  const [myArtworks, setMyArtworks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les œuvres de l'étudiant depuis MySQL au démarrage
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8080/api/oeuvres/etudiant/${user.id}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Impossible de charger les œuvres");
        })
        .then((data) => {
          setMyArtworks(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user?.id]);

  // Fonction déclenchée par le bouton de paiement
  const handlePayerFrais = async () => {
    if (!user || !user.id) return;

    try {
      // 1. Mise à jour dans MySQL via Spring Boot
      const response = await fetch(`http://localhost:8080/api/etudiants/${user.id}/activer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      });

     if (response.ok) {
        setIsActivated(true);
        if (user) {
          user.isActivated = true; 
          // AJOUTE CETTE LIGNE : On met à jour le cache du navigateur avec le statut actif
          localStorage.setItem("artkaba_user", JSON.stringify(user));
        }
        console.log("Paiement validé : Accès messagerie et ajout d'œuvres débloqués !");
      }
      else {
        console.error("Le serveur a refusé l'activation. Vérifie ton endpoint Java.");
      }
    } catch (error) {
      console.error("Erreur réseau lors de la tentative d'activation :", error);
    }
  };

  // Ajouter la nouvelle œuvre créée par Spring Boot à la liste locale
  const handleArtworkAdded = (nouvelleOeuvre) => {
    setMyArtworks((prev) => [nouvelleOeuvre, ...prev]);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-zinc-900 antialiased font-light flex flex-col lg:flex-row">
      
      {/* Barre Latérale de l'Étudiant */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-950">ArtKaba</h3>
            <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 block mt-1">Espace Artiste</span>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded bg-zinc-950 text-white font-medium text-left">
              <Image size={16} /> Mes Œuvres
            </button>
            
            {/* CORRECTION MESSAGERIE : Devient cliquable et change de style dès que isActivated passe à true */}
            <button 
              disabled={!isActivated}
              onClick={() => isActivated && alert("Ouverture de la messagerie...")} // Logique de clic future
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded text-left transition-all ${
                isActivated 
                  ? "text-zinc-900 hover:bg-zinc-50 cursor-pointer font-normal" 
                  : "text-zinc-300 cursor-not-allowed bg-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={16} className={isActivated ? "text-zinc-900" : "text-zinc-300"} /> 
                Messages
              </div>
              {!isActivated && (
                <span className="text-[9px] bg-zinc-100 text-zinc-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Bloqué
                </span>
              )}
            </button>
          </nav>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50/50 rounded transition-colors text-left mt-8 cursor-pointer"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </aside>

      {/* Contenu Principal du Dashboard */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12">
        
        {/* En-tête du profil */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-6 mb-10">
          <div>
            <h2 className="text-2xl font-light text-zinc-950 tracking-tight">
              Bonjour, {user?.nom || "Artiste"}
            </h2>
            <p className="text-zinc-400 text-sm mt-0.5">
              Atelier d'Art Privé • Matricule {user?.matricule || "ABA-2026-TEMP"}
            </p>
          </div>
          
          {/* Badge de Statut Dynamique */}
          <div>
            {isActivated ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full animate-fade-in">
                <CheckCircle size={14} /> Compte Actif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                <AlertCircle size={14} /> En attente d'activation
              </span>
            )}
          </div>
        </div>

        {/* Bloc d'activation : Disparaît automatiquement de l'écran dès que isActivated === true */}
        {!isActivated && (
          <div className="bg-white border border-zinc-200/80 rounded-lg p-6 sm:p-8 mb-10 max-w-3xl shadow-[0_4px_20px_-6px_rgba(0,0,0,0.01)]">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="p-3 bg-[#c5a880]/10 text-[#c5a880] rounded-lg">
                <Wallet size={24} />
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-normal text-zinc-950 tracking-tight">Activez votre vitrine d'exposition</h4>
                  <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                    Pour débloquer l'accès complet, ajouter de nouvelles œuvres et répondre aux messages directs des acheteurs potentiels, vous devez vous acquitter des frais d'abonnement annuels de <strong>2 $ (5 000 CDF)</strong>.
                  </p>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handlePayerFrais} 
                    className="bg-[#c5a880] hover:bg-[#b3966e] text-white text-xs font-medium px-5 py-3 rounded transition-all shadow-sm cursor-pointer"
                  >
                    Payer 2 $ via Mobile Money (IllicoCash / M-Pesa / Orange Money)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section de gestion des œuvres */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-normal text-zinc-950 tracking-tight">Vos créations en ligne</h4>
            
            {/* Bouton d'ajout : Se débloque visuellement et structurellement */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              disabled={!isActivated}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded transition-all shadow-sm ${
                isActivated 
                  ? "bg-zinc-950 hover:bg-zinc-900 text-white cursor-pointer" 
                  : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
              }`}
            >
              <Plus size={14} /> Ajouter une œuvre
            </button>
          </div>

          {/* Tableau horizontal des œuvres */}
          <div className="bg-white border border-zinc-200/60 rounded-lg overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-zinc-200 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    <th className="p-4 font-medium">Titre</th>
                    <th className="p-4 font-medium">Catégorie</th>
                    <th className="p-4 font-medium">Dimensions</th>
                    <th className="p-4 font-medium">Prix d'exposition</th>
                    <th className="p-4 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-zinc-100 font-normal text-zinc-700">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-zinc-400 text-xs">Chargement de votre collection...</td>
                    </tr>
                  ) : myArtworks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-zinc-400 text-xs">Aucune œuvre indexée pour le moment.</td>
                    </tr>
                  ) : (
                    myArtworks.map((art) => (
                      <tr key={art.id} className="hover:bg-[#fafafa]/50 transition-colors">
                        <td className="p-4 text-zinc-950 font-medium">{art.titre}</td>
                        <td className="p-4 text-zinc-500">{art.categorie}</td>
                        <td className="p-4 text-zinc-400">{art.dimensions}</td>
                        <td className="p-4 text-zinc-950 font-medium">{art.prix}</td>
                        <td className="p-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100">
                            En Ligne
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>

      {/* Modale d'ajout d'œuvre */}
      <AddArtworkModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        etudiantId={user?.id}
        onArtworkAdded={handleArtworkAdded}
      /> 
    </div>
  );
}

export default StudentDashboard;
