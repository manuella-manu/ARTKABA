import React, { useState } from 'react';
import { Upload, ShieldCheck, ArrowRight, X } from 'lucide-react';

// On ajoute la prop onRegisterSuccess ici
function Register({ onBackToGallery, onRegisterSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  // Gestion du Drag & Drop pour la carte d'étudiant
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Plus tard, on mettra la logique d'envoi vers l'API ici
    // Pour l'instant, on déclenche directement la bascule vers le dashboard !
    onRegisterSuccess();
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex flex-col lg:flex-row antialiased font-light pt-20 lg:pt-0">
      
      {/* Partie Gauche : Identité visuelle épurée (Masquée sur mobile) */}
      <div className="hidden lg:flex lg:w-[40%] bg-zinc-950 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black opacity-50 z-0" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToGallery}>
            <span className="text-xl font-bold tracking-tight">ArtKaba</span>
          </div>
        </div>

        <div className="relative z-10 max-w-sm">
          <span className="text-[#c5a880] text-xs font-medium uppercase tracking-widest block mb-3">Espace Créateur</span>
          <h3 className="text-3xl font-light tracking-tight leading-tight mb-4">
            Exposez votre art au monde entier.
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Rejoignez l'archive exclusive des étudiants de l'Académie des Beaux-Arts et commencez à interagir avec vos futurs acquéreurs.
          </p>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 border-t border-zinc-800/60 pt-4 flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#c5a880]" />
          Vérification stricte de l'identité académique.
        </div>
      </div>

      {/* Partie Droite : Le Formulaire */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 z-10">
        <div className="w-full max-w-md bg-white border border-zinc-200/60 p-8 sm:p-10 rounded-lg shadow-[0_4px_25px_-12px_rgba(0,0,0,0.02)]">
          
          <div className="mb-8">
            <h4 className="text-2xl font-light text-zinc-950 tracking-tight">Créer un compte artiste</h4>
            <p className="text-zinc-400 text-sm mt-1">Remplissez vos accès et soumettez votre pièce d'identité.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Champ Nom */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Nom complet</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Mukendi Gloire" 
                className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-zinc-950 transition-colors font-normal text-zinc-900"
              />
            </div>

            {/* Champ Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Adresse Email</label>
              <input 
                type="email" 
                required
                placeholder="gloire@aba.com" 
                className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-zinc-950 transition-colors font-normal text-zinc-900"
              />
            </div>

            {/* Zone d'Upload de la Carte d'Étudiant */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Carte d'étudiant (Obligatoire)
              </label>
              
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`w-full border rounded transition-all p-6 text-center flex flex-col items-center justify-center relative cursor-pointer ${
                  dragActive 
                    ? "border-zinc-950 bg-zinc-50" 
                    : "border-dashed border-zinc-300 bg-[#fafafa] hover:bg-zinc-50/50 hover:border-zinc-400"
                }`}
              >
                <input 
                  type="file" 
                  id="student-id-upload" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                
                {fileName ? (
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-zinc-200 text-xs font-medium text-zinc-800">
                    <span className="truncate max-w-[200px]">{fileName}</span>
                    <button type="button" onClick={() => setFileName("")} className="text-zinc-400 hover:text-zinc-950">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-zinc-400 mb-2" />
                    <p className="text-xs text-zinc-600 font-normal">
                      Glissez votre carte ici ou <span className="text-[#c5a880] font-medium underline">parcourez</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1">Format JPG, PNG ou PDF (Max 5Mo)</p>
                  </>
                )}
              </div>
            </div>

            {/* Bouton Soumettre - Déclenche handleSubmit */}
            <button type="submit" className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-medium py-3.5 rounded transition-all text-sm flex items-center justify-center gap-2 mt-8 shadow-sm cursor-pointer">
              Soumettre pour validation <ArrowRight size={16} />
            </button>

            {/* Lien Retour */}
            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={onBackToGallery}
                className="text-xs text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer bg-transparent border-none"
              >
                ← Retourner à la galerie
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Register;