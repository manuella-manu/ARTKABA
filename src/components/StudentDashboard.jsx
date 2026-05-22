import React, { useState } from 'react';
import { Plus, Wallet, Image, MessageSquare, CheckCircle, AlertCircle, LogOut } from 'lucide-react';

function StudentDashboard({ onLogout }) {
  // Simuler si l'étudiant a payé ses 2$ ou non (change à true pour tester la version activée)
  const [isActivated, setIsActivated] = useState(false);
  
  // Liste des œuvres de l'étudiant connecté
  const [myArtworks, setMyArtworks] = useState([
    { id: 1, title: "Regard d'Ébène", type: "Peinture", size: "120 x 90 cm", price: "150 $", status: "Publié" },
    { id: 2, title: "Symphonie Temporelle", type: "Peinture", size: "80 x 80 cm", price: "200 $", status: "Publié" },
  ]);

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-zinc-900 antialiased font-light flex flex-col lg:flex-row">
      
      {/* Barre Latérale de l'Étudiant (Design Rectiligne) */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-zinc-200 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-8">
          {/* Logo & Rôle */}
          <div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-950">ArtKaba</h3>
            <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 block mt-1">Espace Artiste</span>
          </div>

          {/* Navigation interne */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded bg-zinc-950 text-white font-medium text-left">
              <Image size={16} /> Mes Œuvres
            </button>
            <button 
              disabled={!isActivated}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded text-left ${
                isActivated ? "text-zinc-600 hover:bg-zinc-50 cursor-pointer" : "text-zinc-300 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={16} /> Messages
              </div>
              {!isActivated && <span className="text-[9px] bg-zinc-100 text-zinc-400 px-1.5 py-0.5 rounded font-bold">Bloqué</span>}
            </button>
          </nav>
        </div>

        {/* Bouton Déconnexion */}
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
            <h2 className="text-2xl font-light text-zinc-950 tracking-tight">Bonjour, Mukendi Gloire</h2>
            <p className="text-zinc-400 text-sm mt-0.5">Atelier Peinture • Matricule ABA-2026-048</p>
          </div>
          
          {/* Badge de Statut du Compte */}
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

        {/* CONDITION : Si le compte n'est pas activé, on affiche le bloc de paiement des 2$ */}
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
                
                {/* Simulation de bouton de paiement Mobile Money */}
                <div className="pt-2">
                  <button 
                    onClick={() => setIsActivated(true)} // Au clic, on simule la réussite du paiement
                    className="bg-[#c5a880] hover:bg-[#b3966e] text-white text-xs font-medium px-5 py-3 rounded transition-all shadow-sm cursor-pointer"
                  >
                    Payer 2 $ via Mobile Money (IllicoCash / M-pessa / Orange-Money)
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
            <button 
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

          {/* Tableau horizontal rectiligne des œuvres */}
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
                  {myArtworks.map((art) => (
                    <tr key={art.id} className="hover:bg-[#fafafa]/50 transition-colors">
                      <td className="p-4 text-zinc-950 font-medium">{art.title}</td>
                      <td className="p-4 text-zinc-500">{art.type}</td>
                      <td className="p-4 text-zinc-400">{art.size}</td>
                      <td className="p-4 text-zinc-950 font-medium">{art.price}</td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-800">
                          {art.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default StudentDashboard;