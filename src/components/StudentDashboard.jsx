import React, { useState, useEffect } from 'react';
import { Plus, Wallet, Image, MessageSquare, CheckCircle, AlertCircle, LogOut, Mail, Edit2, Trash2 } from 'lucide-react';
import AddArtworkModal from './AddArtworkModal';

function StudentDashboard({ onLogout, user }) {
  // L'état initial dépend du profil utilisateur reçu de Spring Boot
  const [isActivated, setIsActivated] = useState(user?.isActivated || false);
  const [myArtworks, setMyArtworks] = useState([]);
  const [messages, setMessages] = useState([]); // Stockage des messages de l'artiste
  const [activeTab, setActiveTab] = useState("oeuvres"); // Navigation interne : "oeuvres" ou "messages"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // 1. EFFET : Charger les œuvres de l'étudiant depuis MySQL au démarrage
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      fetch(`https://artkaba1-1.onrender.com/api/oeuvres/etudiant/${user.id}`)
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

  // 2. EFFET : Charger les messages de l'étudiant lorsque l'onglet change
  useEffect(() => {
    if (activeTab === "messages" && user?.id) {
      setLoadingMessages(true);
      fetch(`https://artkaba1-1.onrender.com/api/messages/etudiant/${user.id}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Impossible de charger la boîte de réception.");
        })
        .then((data) => {
          setMessages(data);
          setLoadingMessages(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingMessages(false);
        });
    }
  }, [activeTab, user?.id]);

  // Fonction déclenchée par le bouton de paiement
  const handlePayerFrais = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(`https://artkaba1-1.onrender.com/api/etudiants/${user.id}/activer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        setIsActivated(true);
        
        // Correction de la persistance de l'état d'activation dans le cache local
        const cachedUser = localStorage.getItem("artkaba_user");
        if (cachedUser) {
          const updatedUser = JSON.parse(cachedUser);
          updatedUser.isActivated = true;
          localStorage.setItem("artkaba_user", JSON.stringify(updatedUser));
        }
        console.log("Paiement validé : Accès messagerie et ajout d'œuvres débloqués !");
      } else {
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

  // --- NOUVEAU : SUPPRIMER UNE OEUVRE ---
  const handleDeleteArtwork = async (id) => {
    if (window.confirm("Es-tu sûr de vouloir retirer cette œuvre de la galerie ?")) {
      try {
        const response = await fetch(`https://artkaba1-1.onrender.com/api/oeuvres/delete/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Filtrage local pour faire disparaître l'élément instantanément
          setMyArtworks(myArtworks.filter(art => art.id !== id));
        } else {
          console.error("Erreur lors de la suppression sur le serveur.");
        }
      } catch (error) {
        console.error("Erreur réseau lors de la suppression :", error);
      }
    }
  };

  // --- NOUVEAU : MODIFIER UNE OEUVRE (Via prompts de test) ---
  const handleEditArtwork = async (art) => {
    const nouveauTitre = window.prompt("Modifier le titre de l'œuvre :", art.titre);
    const nouveauPrix = window.prompt("Modifier le prix d'exposition :", art.prix);

    if (nouveauTitre !== null && nouveauPrix !== null) {
      const updatedData = { ...art, titre: nouveauTitre, prix: nouveauPrix };

      try {
        const response = await fetch(`https://artkaba1-1.onrender.com/api/oeuvres/update/${art.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData)
        });

        if (response.ok) {
          const result = await response.json();
          // Remplacement dynamique de l'ancienne œuvre par la nouvelle version modifiée
          setMyArtworks(myArtworks.map(a => a.id === art.id ? result : a));
        } else {
          console.error("Le serveur a refusé la modification.");
        }
      } catch (error) {
        console.error("Erreur réseau lors de la modification :", error);
      }
    }
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
            {/* Bouton Onglet : Œuvres */}
            <button 
              onClick={() => setActiveTab("oeuvres")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded text-left transition-all cursor-pointer ${
                activeTab === "oeuvres" 
                  ? "bg-zinc-950 text-white font-medium" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950"
              }`}
            >
              <Image size={16} /> Mes Œuvres
            </button>
            
            {/* Bouton Onglet : Messagerie */}
            <button 
              disabled={!isActivated}
              onClick={() => isActivated && setActiveTab("messages")}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded text-left transition-all ${
                !isActivated 
                  ? "text-zinc-300 cursor-not-allowed bg-transparent"
                  : activeTab === "messages"
                    ? "bg-zinc-950 text-white font-medium cursor-pointer"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={16} /> 
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
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                <CheckCircle size={14} /> Compte Actif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                <AlertCircle size={14} /> En attente d'activation
              </span>
            )}
          </div>
        </div>

        {/* Bloc d'activation */}
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

        {/* AFFICHAGE CONDITIONNEL DES ONGLETS */}
        {activeTab === "oeuvres" ? (
          /* ================= ONGLET 1 : LES OEUVRES ================= */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-normal text-zinc-950 tracking-tight">Vos créations en ligne</h4>
              
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
                      <th className="p-4 font-medium">Actions</th> {/* AJOUT : Colonne actions */}
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-zinc-100 font-normal text-zinc-700">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-zinc-400 text-xs">Chargement de votre collection...</td>
                      </tr>
                    ) : myArtworks.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-zinc-400 text-xs">Aucune œuvre indexée pour le moment.</td>
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
                          {/* AJOUT : Boutons interactifs d'édition et de suppression */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleEditArtwork(art)}
                                title="Modifier l'œuvre"
                                className="text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button 
                                onClick={() => handleDeleteArtwork(art.id)}
                                title="Supprimer l'œuvre"
                                className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ================= ONGLET 2 : LA BOÎTE DE RÉCEPTION (MESSAGES) ================= */
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-lg font-normal text-zinc-950 tracking-tight">Messages et propositions reçus</h4>
            
            <div className="space-y-4 max-w-4xl">
              {loadingMessages ? (
                <div className="text-center py-12 text-zinc-400 text-sm">Chargement de vos messages...</div>
              ) : messages.length === 0 ? (
                <div className="bg-white border border-zinc-200/60 rounded-lg p-10 text-center text-zinc-400 text-sm flex flex-col items-center justify-center gap-3">
                  <Mail size={24} className="text-zinc-300" />
                  <p>Votre boîte de réception est vide. Les messages des acheteurs s'afficheront ici.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className="bg-white border border-zinc-200/60 rounded-lg p-5 transition-all hover:border-zinc-300 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.01)]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-100 text-xs">
                      <div>
                        <span className="font-medium text-zinc-950 text-sm block sm:inline mr-2">{msg.expediteurNom}</span>
                        <span className="text-zinc-400 font-normal">{`<${msg.expediteurEmail}>`}</span>
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <span className="text-zinc-400 font-normal">
                          {new Date(msg.dateEnvoi).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'
                          })}
                        </span>
                        {/* AJOUT : Bouton Répondre (Option mailto sécurisée et rapide) */}
                        <a 
                          href={`mailto:${msg.expediteurEmail}?subject=ArtKaba - Suite à votre message concernant mon œuvre`}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-950 hover:text-white px-2.5 py-1 rounded transition-all"
                        >
                          Répondre
                        </a>
                      </div>
                    </div>
                    <div className="pt-3 text-sm text-zinc-600 leading-relaxed font-normal whitespace-pre-line">
                      {msg.contenu}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

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