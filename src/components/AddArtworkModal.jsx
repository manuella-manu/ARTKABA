import React, { useState } from "react";
import { X, Plus } from "lucide-react";

function AddArtworkModal({ isOpen, onClose, etudiantId, onArtworkAdded }) {
  const [titre, setTitre] = useState("");
  const [categorie, setCategorie] = useState("Peinture");
  const [dimensions, setDimensions] = useState("");
  const [prix, setPrix] = useState("");
  const [bgStyle, setBgStyle] = useState("bg-gradient-to-r from-zinc-900 to-stone-800"); // Style par défaut
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Quelques options de dégradés esthétiques et rectilignes pour le fond
  const presets = [
    { name: "Sombre Absolu", value: "bg-gradient-to-r from-zinc-900 to-stone-800" },
    { name: "Nuit Bleue", value: "bg-gradient-to-r from-slate-900 to-zinc-800" },
    { name: "Bronze Épuré", value: "bg-gradient-to-r from-zinc-800 to-zinc-600" },
    { name: "Minimal Gris", value: "bg-gradient-to-r from-stone-400 to-stone-200" },
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const nouvelleOeuvre = {
      titre,
      categorie,
      dimensions: dimensions || "Format standard",
      prix: prix ? `${prix} $` : "Sur devis",
      bgStyle
    };

    try {
      const response = await fetch(`http://localhost:8080/api/oeuvres/add/${etudiantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nouvelleOeuvre),
      });

      if (response.ok) {
        const data = await response.json();
        onArtworkAdded(data); // Met à jour la liste des œuvres dans le Dashboard
        // Réinitialisation du formulaire
        setTitre("");
        setDimensions("");
        setPrix("");
        onClose(); // Ferme la modale
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
          <p className="text-zinc-400 text-xs mt-1">Publie une nouvelle œuvre dans ton catalogue et sur la galerie.</p>
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

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Style Visuel (Aperçu)</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx} type="button" onClick={() => setBgStyle(preset.value)}
                  className={`p-3 rounded text-left text-xs text-white ${preset.value} border-2 ${bgStyle === preset.value ? 'border-[#c5a880]' : 'border-transparent'} transition-all`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {message && <p className="text-red-500 text-xs">{message}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-medium py-3 rounded text-sm flex items-center justify-center gap-2 mt-4 disabled:bg-zinc-400"
          >
            {loading ? "Enregistrement..." : "Mettre en galerie"} <Plus size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddArtworkModal;