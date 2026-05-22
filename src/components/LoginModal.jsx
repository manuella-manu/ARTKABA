import React, { useState } from "react";
import { X, ArrowRight } from "lucide-react";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        const etudiantConnecte = await response.json();
        console.log("Connexion réussie :", etudiantConnecte);
        onLoginSuccess(etudiantConnecte); // Envoie les données à App.jsx
        onClose(); // Ferme la modale
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText);
      }
    } catch (error) {
      setErrorMessage("Erreur réseau. Vérifie que le backend Spring Boot est démarré.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 relative border border-zinc-100 shadow-xl">
        
        {/* Bouton Fermer */}
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 transition-colors">
          <X size={18} />
        </button>

        {/* En-tête */}
        <div className="mb-6">
          <h3 className="text-xl font-light text-zinc-950 tracking-tight">Espace Étudiant</h3>
          <p className="text-zinc-400 text-xs mt-1">Entre ton adresse email pour accéder à ton atelier d'art.</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Adresse Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: gloire@aba.com" 
              className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-zinc-950 transition-colors text-zinc-900"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-xs font-normal mt-1">{errorMessage}</p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-medium py-3 rounded transition-all text-sm flex items-center justify-center gap-2 mt-2 disabled:bg-zinc-400 cursor-pointer"
          >
            {loading ? "Connexion..." : "Accéder à l'atelier"} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;