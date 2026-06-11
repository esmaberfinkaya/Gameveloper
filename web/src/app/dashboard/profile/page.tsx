"use client";

import { useEffect, useState } from "react";
import { User, Zap, Activity, MessageSquare, Heart, Share2, Hexagon, Trophy, Code, Target, AlertTriangle } from "lucide-react";
import FeedCard from "@/components/FeedCard";
import IdeaCard from "@/components/IdeaCard";
import ProjectCard from "@/components/ProjectCard";
import SolutionCard from "@/components/SolutionCard";
import RoadmapCard from "@/components/RoadmapCard";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        fetchUserPosts(userId);
      } else {
        throw new Error("Kullanıcı bilgisi çekilemedi.");
      }
    } catch (err) {
      console.error(err);
      setError("Profil bilgileri yüklenemedi.");
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async (userId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/explore?userId=${userId}`);
      if (!res.ok) {
        throw new Error("API yanıt vermedi");
      }
      const data = await res.json();
      let myPosts = data.filter((item: any) => item.userId === userId);
      setUserPosts(myPosts);
    } catch (err) {
      console.error("Gönderiler çekilemedi", err);
      setError("Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından emin olun.");
      setUserPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      <div className="flex items-center gap-3 mb-8">
        <User size={32} className="text-accent-purple" />
        <h1 className="text-3xl font-black text-white tracking-widest uppercase">Geliştirici <span className="text-accent-purple">Profili</span></h1>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* Main Profile Identity (Span 2x2) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-card-bg/80 border border-accent-purple/40 hover:border-accent-purple neon-glow-theme rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group flex flex-col items-center justify-center text-center transition-all">
          <div className="absolute top-0 right-0 w-full h-full bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-accent-purple flex items-center justify-center bg-[#0D1117] neon-glow-theme mb-6 relative z-10 group-hover:scale-105 transition-transform duration-500">
            <span className="text-accent-purple font-black text-6xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase mb-2 relative z-10">{user.name}</h2>
          <div className="text-sm text-neon-cyan uppercase tracking-widest font-bold mb-4 inline-block px-4 py-1.5 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full neon-glow-theme relative z-10">
            {user.role}
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto relative z-10">
            {user.role === 'DEVELOPER' ? 'Gameveloper ekosisteminde kod paylaşıyor, çözüm üretiyor ve diğer geliştiricilere mentörlük yapıyor.' : 'Oyun dünyasına vizyon katıyor, yeni fikirler üretiyor ve projelere destek veriyor.'}
          </p>
        </div>

        {/* Trust Score Box (Span 1x2) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 bg-[#05070a] border border-neon-cyan/50 hover:border-neon-cyan neon-glow-theme hover:neon-glow-theme rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all group">
          <div className="absolute -bottom-10 -right-10 text-neon-cyan/5 group-hover:text-neon-cyan/10 transition-colors">
            <Zap size={180} />
          </div>
          
          <Zap size={48} className="text-neon-cyan mb-4 animate-pulse relative z-10 drop-neon-glow-theme" />
          <h3 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-2 relative z-10 font-bold">Trust Score</h3>
          <div className="text-7xl font-black text-neon-cyan text-glow-cyan relative z-10">{user.trustScore}</div>
          <p className="text-xs text-neon-cyan/60 mt-4 text-center relative z-10 uppercase tracking-wider">Topluluk <br/> Güvenilirlik Puanı</p>
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
            {userPosts.length * 3 + 12}
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
            {user.role === 'DEVELOPER' ? 4 : 1}
          </div>
        </div>

        {/* Achievements Banner (Span Full Width) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-gradient-to-r from-neon-pink/20 via-[#0D1117] to-accent-purple/20 border border-gray-800 hover:border-neon-pink/50 rounded-3xl p-6 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neon-pink/20 border border-neon-pink flex items-center justify-center text-neon-pink neon-glow-theme">
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

        {/* Content Section (Span Full Width but split internally) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 mt-4">
          <h3 className="text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2 mb-6 pb-2 border-b border-gray-800">
            <Share2 size={20} className="text-neon-cyan" /> Son Paylaşımlar
          </h3>
          
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
            ) : userPosts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-20 border border-dashed border-gray-800 rounded-3xl bg-card-bg/30 flex flex-col items-center justify-center">
                <Activity size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Henüz hiçbir içerik paylaşılmadı.</p>
                <p className="text-sm text-gray-600 mt-2">Bu kullanıcının paylaşımları burada listelenecek.</p>
              </div>
            ) : (
              userPosts.map((item: any) => {
                if (item.feedType === 'QUESTION') {
                  return <FeedCard key={`q-${item.id}`} {...item} currentUser={user} onUpdate={() => fetchUserPosts(user.id)} isExplore={true} />;
                } else if (item.feedType === 'IDEA') {
                  return <IdeaCard key={`i-${item.id}`} {...item} currentUser={user} onUpdate={() => fetchUserPosts(user.id)} isExplore={true} />;
                } else if (item.feedType === 'PROJECT') {
                  return <ProjectCard key={`p-${item.id}`} {...item} />;
                } else if (item.feedType === 'SOLUTION') {
                  return <SolutionCard key={`s-${item.id}`} {...item} />;
                } else if (item.feedType === 'ROADMAP') {
                  return <RoadmapCard key={`r-${item.id}`} {...item} />;
                }
                return null;
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
