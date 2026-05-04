"use client";

import { useEffect, useState } from "react";
import { MessageSquarePlus, X, Image as ImageIcon, AlertTriangle } from "lucide-react";
import FeedCard from "@/components/FeedCard";

export default function DashboardIssuesPage() {
  const [user, setUser] = useState<any>(null);
  
  // Feed States
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Modal States
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Unity",
    imageUrl: ""
  });

  const CATEGORIES = ["Unity", "Blender", "Flutter", "Node.js", "Python"];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const res = await fetch("http://localhost:5000/api/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (err) {
      console.error("Sorular çekilemedi", err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      });

      if (res.ok) {
        setIsQuestionModalOpen(false);
        setFormData({ title: "", content: "", category: "Unity", imageUrl: "" });
        fetchQuestions();
      }
    } catch (err) {
      console.error("Soru sorulurken hata oluştu", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Soru Modalı (Neon Form) */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card-bg border border-neon-cyan/50 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.15)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h2 className="text-xl font-bold text-neon-cyan text-glow-cyan flex items-center gap-2">
                <MessageSquarePlus size={24} /> Yeni Soru Sor
              </h2>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleQuestionSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Başlık</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Karşılaştığın sorunu özetle..."
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span>Detaylar (Markdown & YouTube Link Destekli)</span>
                    <span className="text-xs text-neon-pink">Kod blokları için ``` kullan</span>
                  </label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Hata detayını, kodlarını veya YouTube linkini buraya yapıştır..."
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition font-mono text-sm resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                    <ImageIcon size={16} className="text-accent-purple" /> Görsel URL (Opsiyonel)
                  </label>
                  <input 
                    type="url" 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition"
                  />
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <p className="text-xs text-gray-400 text-right">
                    Puanın, paylaştığın içeriğin kalitesine göre topluluk tarafından belirlenecek.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsQuestionModalOpen(false)}
                      className="px-5 py-2 rounded-md text-gray-400 hover:text-white transition"
                    >
                      İptal
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan hover:bg-neon-cyan hover:text-black font-bold tracking-wide rounded-md transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)] disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? "Gönderiliyor..." : "Paylaş"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ROL BAZLI UYARI BANNER */}
      <div className="bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Topluluk Kuralları:</strong> Geliştiriciler (DEVELOPER) detaylı çözümler paylaşır ve yön gösterir. Oyuncular (GAMER) ise ağırlıklı olarak fikir belirtir ve tartışmalara katılır. Soru sorarken dürüst olun ve saygıyı koruyun.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-20">
        
        {/* Mobile action button since sidebar is hidden on mobile mostly */}
        <div className="md:hidden flex justify-end mb-4">
          <button 
            onClick={() => setIsQuestionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan rounded-md text-sm font-bold shadow-[0_0_10px_rgba(0,255,255,0.2)]"
          >
            <MessageSquarePlus size={16} /> Yeni Soru Sor
          </button>
        </div>

        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Sorunlar & Akış <span className="text-neon-cyan animate-pulse ml-1">_</span></h1>
          
          <button 
            onClick={() => setIsQuestionModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50 hover:bg-neon-cyan hover:text-black transition-all rounded-md text-sm font-bold"
          >
            <MessageSquarePlus size={16} /> Yeni Soru
          </button>
        </div>

        {isLoadingQuestions ? (
          // Skeleton Posts
          [1, 2, 3].map((item) => (
            <div key={item} className="bg-card-bg/60 border border-gray-800/80 p-5 md:p-6 rounded-xl space-y-4 opacity-60 animate-pulse backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/6"></div>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          ))
        ) : questions.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
            <p>Henüz hiç sorun paylaşılmamış. İlk soruyu sen sor!</p>
          </div>
        ) : (
          questions.map((q: any) => (
            <FeedCard key={q.id} {...q} currentUser={user} onUpdate={fetchQuestions} />
          ))
        )}
        
        <div className="text-center text-gray-600 py-10 text-xs md:text-sm tracking-widest uppercase flex items-center justify-center gap-4 opacity-50">
          <span className="w-12 h-px bg-gray-700"></span>
          Veri Akışı Sonu
          <span className="w-12 h-px bg-gray-700"></span>
        </div>

      </div>

      {/* Global Style overrides for markdown tags */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-markdown-body p { margin-bottom: 0.75rem; }
        .custom-markdown-body pre {
          background-color: #05070a;
          border: 1px solid #1f2937;
          border-left: 2px solid var(--neon-cyan);
          border-radius: 0.375rem;
          padding: 1rem;
          overflow-x: auto;
          box-shadow: inset 0 0 10px rgba(0,255,255,0.05);
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .custom-markdown-body pre code { background-color: transparent; color: #fff; text-shadow: 0 0 5px rgba(0,255,255,0.4); padding: 0; }
        .custom-markdown-body code {
          background-color: rgba(0, 255, 255, 0.1);
          color: var(--neon-cyan);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
        }
      `}} />
    </>
  );
}
