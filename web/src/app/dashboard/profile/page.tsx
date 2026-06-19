"use client";

import { useEffect, useState } from "react";
import { User, Zap, Activity, MessageSquare, Heart, Share2, Hexagon, Trophy, Code, Target, AlertTriangle, BatteryCharging, FolderPlus } from "lucide-react";
import FeedCard from "@/components/FeedCard";
import IdeaCard from "@/components/IdeaCard";
import ProjectCard from "@/components/ProjectCard";
import SolutionCard from "@/components/SolutionCard";
import RoadmapCard from "@/components/RoadmapCard";
import ProjectShareModal from "@/components/ProjectShareModal";
import ProjectDetailModal from "@/components/ProjectDetailModal";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'issues' | 'ideas' | 'partnerships' | 'projects'>('issues');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      fetchUserData(parsedUser.id);
    }
  }, []);


  const fetchUserData = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (res.ok) {
        const fullUser = await res.json();
        setUser(fullUser);
      } else {
        throw new Error("Kullanıcı bilgisi çekilemedi.");
      }
    } catch (err) {
      console.error(err);
      setError("Profil bilgileri yüklenemedi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Dosya boyutu 2MB'den küçük olmalıdır.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch(`http://localhost:5000/api/users/${user.id}/avatar`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: base64String })
        });
        
        if (res.ok) {
          setUser({ ...user, avatar: base64String });
          // Update local storage too so it persists across reloads quickly
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...storedUser, avatar: base64String }));
        }
      } catch (err) {
        console.error("Avatar yüklenemedi:", err);
        alert("Avatar yüklenirken bir hata oluştu.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };


  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex items-center gap-3 mb-8">
        <User size={32} className="text-theme-accent" />
        <h1 className="text-3xl font-black text-white tracking-widest uppercase">
          {user.role === 'GAMER' ? 'Oyuncu' : 'Geliştirici'} <span className="text-theme-accent">Profili</span>
        </h1>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Main Profile Identity (Span 2x2) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-card-bg/80 border border-theme-accent/40 hover:border-theme-accent neon-glow-theme rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group flex flex-col items-center justify-center text-center transition-all">
          <div className="absolute top-0 right-0 w-full h-full bg-theme-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative group/avatar cursor-pointer">
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-theme-accent flex items-center justify-center bg-[#0D1117] neon-glow-theme mb-6 relative z-10 transition-transform duration-500 ${isUploading ? 'animate-pulse' : 'group-hover/avatar:scale-105'}`}>
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-theme-accent font-black text-6xl">{user.name.charAt(0).toUpperCase()}</span>
              )}
              
              {/* Upload Overlay */}
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold uppercase tracking-wider text-center px-2">
                  {isUploading ? 'Yükleniyor...' : 'Avatar Yükle (Max 2MB)'}
                </span>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase mb-2 relative z-10">{user.name}</h2>
          <div className="text-sm text-theme-accent uppercase tracking-widest font-bold mb-4 inline-block px-4 py-1.5 bg-theme-accent/10 border border-theme-accent/30 rounded-full neon-glow-theme relative z-10">
            {user.role}
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto relative z-10">
            {user.role === 'DEVELOPER' ? 'Gameveloper ekosisteminde kod paylaşıyor, çözüm üretiyor ve diğer geliştiricilere mentörlük yapıyor.' : 'Oyun dünyasına vizyon katıyor, yeni fikirler üretiyor ve projelere destek veriyor.'}
          </p>
        </div>

        {/* Trust Score Box (Battery Indicator) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 bg-[#05070a] border border-theme-accent/50 hover:border-theme-accent neon-glow-theme hover:neon-glow-theme rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all group">
          <div className="absolute -bottom-10 -right-10 text-theme-accent/5 group-hover:text-theme-accent/10 transition-colors">
            <BatteryCharging size={180} />
          </div>
          
          <BatteryCharging size={48} className="text-theme-accent mb-4 animate-pulse relative z-10 drop-neon-glow-theme" />
          <h3 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10 font-bold">Trust Score</h3>
          
          {/* Battery UI */}
          <div className="w-full h-12 bg-gray-900 border-2 border-theme-accent/50 rounded-lg relative overflow-hidden flex items-center justify-center z-10 shadow-[0_0_15px_rgba(var(--theme-accent),0.3)]">
            <div 
              className="absolute left-0 top-0 h-full bg-theme-accent/80 transition-all duration-1000 ease-out"
              style={{ width: `${user.trustScore}%` }}
            ></div>
            <span className="relative z-20 text-white font-black text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] tracking-widest">{user.trustScore} / 100</span>
          </div>
          
          <p className="text-xs text-theme-accent/60 mt-4 text-center relative z-10 uppercase tracking-wider">Topluluk <br/> Güvenilirlik Puanı</p>
        </div>

        {/* Stats 1: Solutions (Span 1x1) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-card-bg/60 border border-theme-accent/30 hover:border-theme-accent rounded-3xl p-6 flex flex-col justify-between group transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold">Çözülen<br/>Sorunlar</h3>
            <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent group-hover:scale-110 transition-transform">
              <Code size={20} />
            </div>
          </div>
          <div className="text-4xl font-black text-theme-accent mt-4 shadow-theme-accent/50 drop-shadow-md">
            {user.stats?.issues || 0}
          </div>
        </div>

        {/* Stats 2: Projects (Span 1x1) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-card-bg/60 border border-theme-accent/30 hover:border-theme-accent rounded-3xl p-6 flex flex-col justify-between group transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold">Tamamlanan<br/>Projeler</h3>
            <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center text-theme-accent group-hover:scale-110 transition-transform">
              <Target size={20} />
            </div>
          </div>
          <div className="text-4xl font-black text-theme-accent mt-4 drop-shadow-md">
            {user.stats?.projects || 0}
          </div>
        </div>

        {/* Achievements Banner (Span Full Width) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-gradient-to-r from-neon-pink/20 via-[#0D1117] to-accent-purple/20 border border-gray-800 hover:border-theme-accent/50 rounded-3xl p-6 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-theme-accent/20 border border-theme-accent flex items-center justify-center text-theme-accent neon-glow-theme">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wider">Erken Erişim Üyesi</h3>
              <p className="text-xs text-gray-400">Platformun ilk 100 kullanıcısından biri olma başarısı.</p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center opacity-50">
                 <Hexagon size={14} className="text-gray-500" />
               </div>
             ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
            <h3 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <Share2 size={20} className="text-theme-accent" /> Kendi Paylaşımlarım
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveFilter('issues')}
                className={`px-4 py-2 text-sm font-bold tracking-wider uppercase rounded-lg border transition-all ${activeFilter === 'issues' ? 'bg-theme-accent/20 border-theme-accent text-theme-accent neon-glow-theme' : 'bg-transparent border-gray-800 text-gray-500 hover:text-white'}`}
              >
                Sorunlarım
              </button>
              <button 
                onClick={() => setActiveFilter('ideas')}
                className={`px-4 py-2 text-sm font-bold tracking-wider uppercase rounded-lg border transition-all ${activeFilter === 'ideas' ? 'bg-theme-accent/20 border-theme-accent text-theme-accent neon-glow-theme' : 'bg-transparent border-gray-800 text-gray-500 hover:text-white'}`}
              >
                Fikirlerim
              </button>
              <button 
                onClick={() => setActiveFilter('partnerships')}
                className={`px-4 py-2 text-sm font-bold tracking-wider uppercase rounded-lg border transition-all ${activeFilter === 'partnerships' ? 'bg-theme-accent/20 border-theme-accent text-theme-accent neon-glow-theme' : 'bg-transparent border-gray-800 text-gray-500 hover:text-white'}`}
              >
                İlanlarım
              </button>
              <button 
                onClick={() => setActiveFilter('projects')}
                className={`px-4 py-2 text-sm font-bold tracking-wider uppercase rounded-lg border transition-all ${activeFilter === 'projects' ? 'bg-theme-accent/20 border-theme-accent text-theme-accent neon-glow-theme' : 'bg-transparent border-gray-800 text-gray-500 hover:text-white'}`}
              >
                Projelerim
              </button>
              
              {user.role === 'DEVELOPER' && (
                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="ml-4 px-4 py-2 text-sm font-bold tracking-wider uppercase rounded-lg bg-theme-accent text-black hover:bg-theme-accent/90 transition-all flex items-center gap-2"
                >
                  <FolderPlus size={16} /> Proje Paylaş
                </button>
              )}
            </div>
          </div>
          
          {(() => {
            let activeList: any[] = [];
            if (activeFilter === 'issues') activeList = user?.issues || [];
            else if (activeFilter === 'ideas') activeList = user?.ideas || [];
            else if (activeFilter === 'partnerships') activeList = user?.partnerships || [];
            else if (activeFilter === 'projects') activeList = user?.projects || [];
            
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {error ? (
                  <div className="col-span-full text-center text-theme-accent py-10 border border-dashed border-theme-accent/50 rounded-xl bg-theme-accent/10">
                    <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-bold">{error}</p>
                    <button 
                      onClick={() => fetchUserData(user.id)} 
                      className="mt-4 px-4 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent/50 rounded hover:bg-theme-accent/40 transition"
                    >
                      Tekrar Dene
                    </button>
                  </div>
                ) : isLoading ? (
                  <div className="col-span-full text-center text-gray-500 py-10">Yükleniyor...</div>
                ) : activeList.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-20 border border-dashed border-gray-800 rounded-3xl bg-card-bg/30 flex flex-col items-center justify-center">
                    <Activity size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">Bu kategoride içerik bulunmuyor.</p>
                    <p className="text-sm text-gray-600 mt-2">Daha fazla paylaşım yaparak ekosisteme katkıda bulunun.</p>
                  </div>
                ) : (
                  activeList.map((item: any) => {
                    if (activeFilter === 'issues') {
                      return <FeedCard key={`q-${item.id}`} {...item} currentUser={user} onUpdate={() => fetchUserData(user.id)} isExplore={true} />;
                    } else if (activeFilter === 'ideas') {
                      return <IdeaCard key={`i-${item.id}`} {...item} currentUser={user} onUpdate={() => fetchUserData(user.id)} isExplore={true} />;
                    } else if (activeFilter === 'partnerships') {
                      return (
                        <div key={`p-${item.id}`} className="bg-card-bg/80 border border-theme-accent/40 rounded-xl p-6">
                          <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                          <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                          <div className="text-xs font-bold text-theme-accent px-3 py-1 bg-theme-accent/10 border border-theme-accent/30 rounded inline-block">
                            {item.requiredRole}
                          </div>
                        </div>
                      );
                    } else if (activeFilter === 'projects') {
                      return <ProjectCard key={`proj-${item.id}`} {...item} user={{ id: user.id, name: user.name, role: user.role }} currentUser={user} onUpdate={() => fetchUserData(user.id)} onClick={() => { setSelectedProject(item); setIsProjectModalOpen(true); }} />;
                    }
                    return null;
                  })
                )}
              </div>
            );
          })()}
        </div>

      </div>

      <ProjectShareModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        user={user} 
        onUpdate={() => fetchUserData(user.id)} 
      />

      <ProjectDetailModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
      />
    </div>
  );
}
