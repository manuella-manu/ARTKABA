import React, { useState } from "react";
import { X, Send } from "lucide-react";

function ContactModal({ isOpen, onClose, artwork }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  if (!isOpen || !artwork) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const payload = {
      etudiantId: artwork.etudiant?.id, // On cible l'ID de l'auteur de l'œuvre
      expediteurNom: nom,
      expediteurEmail: email,
      contenu: contenu
    };

    try {
      const response = await fetch("https://artkaba1-1.onrender.com/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus({ type: "success", message: "Votre message a bien été envoyé à l'artiste !" });
        setNom("");
        setEmail("");
        setContenu("");
        setTimeout(() => {
          onClose();
          setStatus({ type: "", message: "" });
        }, 2000);
      } else {
        setStatus({ type: "error", message: "Impossible d'envoyer le message pour le moment." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Erreur de connexion avec le serveur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-lg p-6 relative border border-zinc-100 shadow-xl">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600">
          <X size={18} />
        </button>

        <div className="mb-6">
          <h3 className="text-lg font-light text-zinc-950 tracking-tight">Contacter l'artiste</h3>
          <p className="text-zinc-400 text-xs mt-1">
            Intéressé par <span className="font-normal text-zinc-600">"{artwork.titre}"</span> ? Laissez un message à l'auteur.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Votre Nom</label>
            <input 
              type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
              placeholder="Ex: Christian Mwamba" className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 text-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Votre Adresse Email</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: christian@mail.com" className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 text-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Votre Message</label>
            <textarea 
              required rows="4" value={contenu} onChange={(e) => setContenu(e.target.value)}
              placeholder="Proposez une offre ou posez vos questions sur les dimensions, la technique..." 
              className="w-full bg-[#fafafa] border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 text-zinc-900 resize-none"
            />
          </div>

          {status.message && (
            <p className={`text-xs font-medium ${status.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
              {status.message}
            </p>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-medium py-3 rounded text-sm flex items-center justify-center gap-2 mt-2 disabled:bg-zinc-400 cursor-pointer"
          >
            {loading ? "Envoi..." : "Envoyer le message"} <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;