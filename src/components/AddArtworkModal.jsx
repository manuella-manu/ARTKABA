import React, { useState } from "react";
import { X, Plus, Image as ImageIcon } from "lucide-react";

function AddArtworkModal({ isOpen, onClose, etudiantId, onArtworkAdded }) {
  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState("Peinture");
  const [dimensions, setDimensions] = useState("");
  const [prix, setPrix] = useState("");
  
  // NOUVEAUX ÉTATS : Pour gérer le fichier image et son aperçu à l'écran
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  // Gérer le choix du fichier et créer une URL d'aperçu temporaire
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Crée un lien temporaire pour l'afficher dans la modale
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      setMessage("Veuillez sélectionner une image pour votre œuvre.");
      return;
    }

    setLoading(true);
    setMessage("");

    // OBLIGATOIRE POUR L'UPLOAD : On emballe tout dans un objet FormData
    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("categorie", categorie);
    formData.append("dimensions", dimensions || "Format standard");
    formData.append("prix", prix ? `${prix} $` : "Sur devis");
    formData.append("etudiantId", etudiantId);
    formData.append("image", imageFile); // C'est ici que le fichier binaire est injecté

    try {
      // On attaque l'endpoint d'upload du contrôleur Spring Boot
      const response = await fetch("https://artkaba1-1.onrender.com/api/oeuvres/add", {
        method: "POST",
        // ATTENTION : Ne surtout pas mettre de "Content-Type" header ici. 
        // Le navigateur va le configurer tout seul en 'multipart/form-data' avec le bon boundary.
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onArtworkAdded(data); // Met à jour la liste dans le Dashboard
        
        // Réinitialisation du formulaire
        setTitre("");
        setDimensions("");
        setPrix("");
        setImageFile(null);
        setImagePreview(null);
        onClose(); 
      } else {
        setMessage("Erreur lors de la sauvegarde de l'œuvre.");
      }
    } catch (error) {
      setMessage("Impossible de joindre le serveur Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 relative border border-zinc-100 shadow-xl">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
          <X size={18} />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-light text-zinc-950 tracking-tight">Ajouter une création</h3>
          <p className="text-zinc-400 text-xs mt-1">Publie une nouvelle œuvre originale dans ton catalogue d'artiste.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Titre de l'œuvre</label>
            <input 
              type="text" required value={titre} onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Éveil Cosmique" className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 text-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Catégorie</label>
              <select 
                value={categorie} onChange={(e) => setCategorie(e.target.value)}
                className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 text-zinc-900"
              >
                <option>Peinture</option>
                <option>Sculpture</option>
                <option>Dessin</option>
                <option>Design</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Prix ($)</label>
              <input 
                type="number" value={prix} onChange={(e) => setPrix(e.target.value)}
                placeholder="Ex: 250" className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 text-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Dimensions</label>
            <input 
              type="text" value={dimensions} onChange={(e) => setDimensions(e.target.value)}
              placeholder="Ex: 100 x 80 cm" className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 text-zinc-900"
            />
          </div>

          {/* SÉLECTEUR DE FICHIER IMAGE ET RELEVÉ DE VUE */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Photographie de l'œuvre</label>
            
            <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-lg p-4 bg-[#fafafa] hover:bg-zinc-50/50 transition-colors relative min-h-[140px]">
              {imagePreview ? (
                // Si une image est choisie, on affiche l'aperçu à l'intérieur
                <div className="w-full flex flex-col items-center gap-2">
                  <img src={imagePreview} alt="Aperçu" className="max-h-32 object-contain rounded border border-zinc-200" />
                  <button 
                    type="button" 
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Changer d'image
                  </button>
                </div>
              ) : (
                // Sinon, zone de dépôt classique cliquable
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                  <ImageIcon size={28} className="text-zinc-400 mb-2" />
                  <span className="text-xs text-zinc-600 font-medium">Cliquez pour charger une image</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG jusqu'à 5 Mo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          </div>

          {message && <p className="text-red-500 text-xs font-medium">{message}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-medium py-3 rounded text-sm flex items-center justify-center gap-2 mt-4 disabled:bg-zinc-400 cursor-pointer"
          >
            {loading ? "Téléchargement..." : "Mettre en galerie"} <Plus size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddArtworkModal;