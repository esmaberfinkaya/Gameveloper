"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Lightbulb, X } from "lucide-react";
import IdeaCard from "@/components/IdeaCard";

export default function IdeasPage() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    story: "",
    visuals: "",
    gameplay: "",
    category: "Genel"
  });

  const CATEGORIES = ["Aksiyon", "RPG", "Puzzle", "Korku", "Strateji", "Genel"];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchIdeas();
    }
  }, [user]);

  const fetchIdeas = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas?userId=${user?.id}`);
      if (!res.ok) {
        throw new Error("Sunucu yanıt vermedi");
      }
      const data = await res.json();
      setIdeas(data);
    } catch (err) {
      console.error("Fikirler çekilemedi", err);
      setError("Sunucu bağlantısı kurulamadı. Lütfen backend'in çalıştığından emin olun.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", story: "", visuals: "", gameplay: "", category: "Genel" });
        fetchIdeas();
      }
    } catch (err) {
      console.error("Fikir paylaşılırken hata oluştu", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ROL BAZLI UYARI BANNER */}
      <div className="bg-theme-accent/10 border border-theme-accent/30 text-theme-accent px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Fikir Havuzu:</strong> Geliştiriciler oyun mekanikleri ve teknik fikirlerini paylaşır. Tüm tartışmalar telif hakkı korkusu olmadan yapılabilir. Fikirler "Gizli Yorum" olarak işaretlenirse sadece yazar ve yorumu yapan arasında kalır.</p>
      </div>

      {/* Fikir Modalı (Neon Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card-bg border border-theme-accent/50 rounded-xl neon-glow-theme w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h2 className="text-xl font-bold text-theme-accent text-glow-theme flex items-center gap-2">
                <Lightbulb size={24} /> Yeni Fikir Paylaş
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleIdeaSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Oyunun Adı / Fikir Başlığı</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Örn: Zamanı Donduran Kılıç Ustası..."
                      className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tür / Kategori</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span>1. Hikaye (Story)</span>
                    <span className="text-[10px] text-theme-accent">Markdown Destekli</span>
                  </label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.story}
                    onChange={(e) => setFormData({...formData, story: e.target.value})}
                    placeholder="Oyunun geçtiği evren, ana karakterin amacı..."
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition font-mono text-sm resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span>2. Görüntü (Visuals)</span>
                    <span className="text-[10px] text-theme-accent">Markdown Destekli</span>
                  </label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.visuals}
                    onChange={(e) => setFormData({...formData, visuals: e.target.value})}
                    placeholder="Kamera açısı, sanat stili (örn: Low poly, Cyberpunk, 2D Pixel Art)..."
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition font-mono text-sm resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span>3. Oynanış (Gameplay)</span>
                    <span className="text-[10px] text-theme-accent">Markdown Destekli</span>
                  </label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.gameplay}
                    onChange={(e) => setFormData({...formData, gameplay: e.target.value})}
                    placeholder="Temel mekanikler, oyuncunun etkileşimleri, ilerleme sistemi..."
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition font-mono text-sm resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 rounded-md text-gray-400 hover:text-white transition"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent hover:bg-theme-accent hover:text-white font-bold tracking-wide rounded-md transition-all neon-glow-theme disabled:opacity-50"
                  >
                    {isSubmitting ? "Gönderiliyor..." : "Fikri Yayına Al"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Fikir Havuzu <span className="text-theme-accent animate-pulse ml-1">_</span></h1>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-theme-accent/10 text-theme-accent border border-theme-accent/50 hover:bg-theme-accent hover:text-white transition-all rounded-md text-sm font-bold"
          >
            <Lightbulb size={16} /> Fikir Paylaş
          </button>
        </div>

        {error ? (
          <div className="text-center text-theme-accent py-10 border border-dashed border-theme-accent/50 rounded-xl bg-theme-accent/10 mb-6">
            <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-bold">{error}</p>
            <button 
              onClick={fetchIdeas} 
              className="mt-4 px-4 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent/50 rounded hover:bg-theme-accent/40 transition"
            >
              Tekrar Dene
            </button>
          </div>
        ) : isLoading ? (
          // Skeleton
          [1, 2].map((item) => (
            <div key={item} className="bg-card-bg/60 border border-gray-800/80 p-5 md:p-6 rounded-xl space-y-4 opacity-60 animate-pulse backdrop-blur-sm mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-20 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : ideas.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
            <p>Henüz fikir paylaşılmamış. İlk parlak fikrini sen paylaş!</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <IdeaCard 
              key={idea.id} 
              {...idea} 
              currentUser={user} 
              onUpdate={fetchIdeas} 
            />
          ))
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-markdown-body p { margin-bottom: 0.75rem; }
        .custom-markdown-body pre {
          background-color: #05070a;
          border: 1px solid #1f2937;
          border-left: 2px solid var(--accent-purple);
          border-radius: 0.375rem;
          padding: 1rem;
          overflow-x: auto;
          box-shadow: inset 0 0 10px rgba(188,19,254,0.05);
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .custom-markdown-body pre code { background-color: transparent; color: #fff; text-shadow: 0 0 5px rgba(188,19,254,0.4); padding: 0; }
      `}} />
    </>
  );
}
