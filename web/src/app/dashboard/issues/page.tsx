"use client";

import { useEffect, useState } from "react";
import { MessageSquarePlus, Compass, Target, X, Image as ImageIcon, AlertTriangle, Globe } from "lucide-react";
import FeedCard from "@/components/FeedCard";
import IdeaCard from "@/components/IdeaCard";
import ProjectCard from "@/components/ProjectCard";
import SolutionCard from "@/components/SolutionCard";
import ProjectDetailModal from "@/components/ProjectDetailModal";

export default function ExplorePage() {
  const [user, setUser] = useState<any>(null);
  
  // Feed States
  const [mixFeed, setMixFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("unresolved"); // unresolved, all

  // Modal States
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectDetailModalOpen, setIsProjectDetailModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Unity",
    suggestedCategory: "",
    githubLink: "",
    codeSnippet: "",
    imageUrl: ""
  });


  const CATEGORIES = ["Unity", "Blender", "Flutter", "Node.js", "Python"];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchExploreFeed();
    }
  }, [user, activeFilter]);

  const fetchExploreFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiFilter = activeFilter === "unresolved" ? "unresolved" : "questions";
      const res = await fetch(`http://localhost:5000/api/explore?filter=${apiFilter}&userId=${user?.id}`);
      if (!res.ok) {
        throw new Error("API yanıt vermedi");
      }
      const data = await res.json();
      setMixFeed(data);
    } catch (err) {
      console.error("Akış çekilemedi", err);
      setError("Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından emin olun.");
      setMixFeed([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (formData.codeSnippet && formData.codeSnippet.split('\n').length > 150) {
      alert("Hızlı kod bloğu maksimum 150 satır olabilir!");
      setIsSubmitting(false);
      return;
    }

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
        setFormData({ title: "", content: "", category: "Unity", suggestedCategory: "", githubLink: "", codeSnippet: "", imageUrl: "" });
        fetchExploreFeed();
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
          <div className="bg-card-bg border border-theme-accent/50 rounded-xl neon-glow-theme w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h2 className="text-xl font-bold text-theme-accent text-glow-theme flex items-center gap-2">
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
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span>Detaylar (Markdown & YouTube Link Destekli)</span>
                    <span className="text-xs text-theme-accent">Kod blokları için ``` kullan</span>
                  </label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Hata detayını, mantığı veya YouTube linkini buraya yapıştır..."
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition resize-none custom-scrollbar"
                  ></textarea>
                </div>

                {/* HIZLI KOD BLOĞU */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span className="flex items-center gap-2"><span className="text-theme-accent font-mono">&gt;_</span> Hızlı Kod Bloğu</span>
                    <span className="text-xs text-theme-accent/50">Maks. 150 Satır</span>
                  </label>
                  <div className="relative bg-[#05070a] border border-gray-700 rounded-md flex overflow-hidden">
                    {/* Line numbers mock */}
                    <div className="w-8 bg-gray-900 border-r border-gray-800 text-gray-600 text-xs font-mono text-right pr-2 py-2 select-none overflow-hidden">
                       {Array.from({length: Math.max(1, (formData.codeSnippet.match(/\n/g) || []).length + 1)}).map((_, i) => <div key={i}>{i+1}</div>)}
                    </div>
                    <textarea 
                      rows={4}
                      value={formData.codeSnippet}
                      onChange={(e) => setFormData({...formData, codeSnippet: e.target.value})}
                      placeholder="// Kodunuzu buraya yapıştırın..."
                      className="w-full bg-transparent border-none px-4 py-2 text-theme-accent font-mono text-sm focus:outline-none resize-y custom-scrollbar"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GITHUB LINKI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Linki (Opsiyonel)</label>
                    <input 
                      type="url" 
                      value={formData.githubLink}
                      onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                      placeholder="https://github.com/user/repo"
                      className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition"
                    />
                    {formData.githubLink.includes('github.com') && (
                      <div className="mt-2 p-2 border border-theme-accent/30 bg-theme-accent/5 rounded flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                          <img src="/github-mark.png" alt="GH" className="w-6 h-6 opacity-80" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                        <div className="text-xs">
                          <p className="text-white font-bold truncate max-w-[200px]">{formData.githubLink.split('github.com/')[1]}</p>
                          <p className="text-theme-accent">Verified Repository</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* KATEGORI ONER */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Kategori Öner</label>
                    <input 
                      type="text" 
                      value={formData.suggestedCategory}
                      onChange={(e) => setFormData({...formData, suggestedCategory: e.target.value})}
                      placeholder="Örn: Godot, C++"
                      className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition"
                    />
                  </div>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                    <ImageIcon size={16} className="text-theme-accent" /> Görsel URL (Opsiyonel)
                  </label>
                  <input 
                    type="url" 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition"
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
                      className="px-6 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent hover:bg-theme-accent hover:text-black font-bold tracking-wide rounded-md transition-all neon-glow-theme disabled:opacity-50 flex items-center gap-2"
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
      <div className="bg-theme-accent/10 border border-theme-accent/30 text-theme-accent px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Topluluk Kuralları:</strong> Geliştiriciler (DEVELOPER) detaylı çözümler paylaşır ve yön gösterir. Oyuncular (GAMER) ise ağırlıklı olarak fikir belirtir ve tartışmalara katılır. Soru sorarken dürüst olun ve saygıyı koruyun.</p>
      </div>

      <div className="max-w-6xl mx-auto pb-20">
        
        {/* Mobile action button */}
        <div className="md:hidden flex justify-end mb-4">
          <button 
            onClick={() => setIsQuestionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent rounded-md text-sm font-bold neon-glow-theme"
          >
            <MessageSquarePlus size={16} /> Yeni Soru
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <MessageSquarePlus size={32} className="text-theme-accent" /> Sorunlar <span className="text-theme-accent animate-pulse">_</span>
          </h1>
          
          <button 
            onClick={() => setIsQuestionModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-theme-accent/10 text-theme-accent border border-theme-accent/50 hover:bg-theme-accent hover:text-black transition-all rounded-md text-sm font-bold"
          >
            <MessageSquarePlus size={16} /> Yeni Soru
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col gap-4 mb-8 border-b border-gray-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => setActiveFilter("unresolved")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeFilter === "unresolved" ? 'bg-theme-accent text-white neon-glow-theme border border-theme-accent' : 'bg-[#0D1117] text-gray-400 border border-gray-800 hover:border-theme-accent/50'}`}
            >
              <Target size={18} /> Çözülmemiş
            </button>
            <button 
              onClick={() => setActiveFilter("questions")}
              className={`px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeFilter === "questions" ? 'bg-theme-accent text-white neon-glow-theme border border-theme-accent' : 'bg-[#0D1117] text-gray-400 border border-gray-800 hover:border-theme-accent/50'}`}
            >
              <MessageSquarePlus size={18} /> Tüm Sorunlar
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest mr-2">Kategoriler:</span>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold border transition-all ${activeFilter === cat ? 'bg-theme-accent/20 text-theme-accent border-theme-accent shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'bg-[#0D1117] text-gray-400 border-gray-800 hover:border-gray-600'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>


        {/* GRID LAYOUT - Now with dynamic columns based on content, but max 2 for better visibility of wide cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {error ? (
            <div className="col-span-full text-center text-theme-accent py-20 border border-dashed border-theme-accent/50 rounded-xl bg-theme-accent/10">
              <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-bold">{error}</p>
              <button 
                onClick={fetchExploreFeed} 
                className="mt-4 px-4 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent/50 rounded hover:bg-theme-accent/40 transition"
              >
                Tekrar Dene
              </button>
            </div>
          ) : isLoading ? (
            // Skeleton Posts
            [1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-card-bg/60 border border-gray-800/80 p-5 rounded-xl space-y-4 opacity-60 animate-pulse backdrop-blur-sm h-48">
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
                </div>
              </div>
            ))
          ) : mixFeed.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-20 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
              <Compass size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Bu filtreye uygun içerik bulunamadı.</p>
            </div>
          ) : (
            mixFeed.map((item: any) => {
              if (item.feedType === 'QUESTION') {
                return <FeedCard key={`q-${item.id}`} {...item} currentUser={user} onUpdate={fetchExploreFeed} isExplore={true} />;
              }
              return null;
            })
          )}
        </div>
        
        {!isLoading && mixFeed.length > 0 && (
          <div className="text-center text-gray-600 py-10 mt-10 text-xs md:text-sm tracking-widest uppercase flex items-center justify-center gap-4 opacity-50">
            <span className="w-12 h-px bg-gray-700"></span>
            Akış Sonu
            <span className="w-12 h-px bg-gray-700"></span>
          </div>
        )}

      </div>

      <ProjectDetailModal 
        isOpen={isProjectDetailModalOpen} 
        onClose={() => { setIsProjectDetailModalOpen(false); setSelectedProject(null); }} 
        project={selectedProject} 
      />

      {/* Global Style overrides for markdown tags */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-markdown-body p { margin-bottom: 0.5rem; }
        .custom-markdown-body pre {
          background-color: #05070a;
          border: 1px solid #1f2937;
          border-left: 2px solid var(--neon-cyan);
          border-radius: 0.375rem;
          padding: 1rem;
          overflow-x: auto;
          box-shadow: inset 0 0 10px rgba(0,255,255,0.05);
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
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
