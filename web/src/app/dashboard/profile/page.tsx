"use client";

import { useEffect, useState } from "react";
import { User, Zap, Activity, MessageSquare, Heart, Share2, Hexagon, Trophy, Code, Target } from "lucide-react";
import FeedCard from "@/components/FeedCard";
import IdeaCard from "@/components/IdeaCard";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserPosts(parsedUser.id);
    }
  }, []);

  const fetchUserPosts = async (userId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/explore?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        let myPosts = data.filter((item: any) => item.userId === userId);
        
        const mockItems = [
          {
            id: 901,
            feedType: "PROJECT",
            title: "Cyber Neon - Fast Paced Shooter",
            description: "Merhaba arkadaşlar, 6 aydır üzerinde çalıştığım neon temalı cyberpunk FPS oyunumun ilk oynanış videosu ve Steam sayfası yayında.",
            category: "Showcase",
            createdAt: new Date().toISOString(),
            user: { id: 1, name: "Esma", role: "DEVELOPER" }
          },
          {
            id: 902,
            feedType: "QUESTION",
            title: "NullReferenceException at PlayerMovement.cs",
            content: "Karakter zıplama kodunu yazarken Rigidbody bileseni null dönüyor.",
            category: "Unity",
            isResolved: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            user: { id: 2, name: "CyberDev", role: "DEVELOPER" }
          },
          {
            id: 903,
            feedType: "IDEA",
            title: "Zamanı Donduran Kılıç Ustası",
            story: "Ana karakter zamanı yavaşlatabiliyor ancak hareket ettikçe kendi canı azalıyor.",
            category: "Aksiyon",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            user: { id: 4, name: "AlphaGamer", role: "GAMER" }
          },
          {
            id: 904,
            feedType: "PROJECT",
            title: "Sci-Fi Koridor Render",
            description: "Blender Eevee kullanarak hazırladığım yeni çevre tasarımı.",
            category: "Art",
            createdAt: new Date(Date.now() - 10800000).toISOString(),
            user: { id: 3, name: "BlenderMaster", role: "DEVELOPER" }
          }
        ];
        
        const myMocks = mockItems.filter(item => item.user.name === user.name);
        setUserPosts([...myPosts, ...myMocks]);
      }
    } catch (err) {
      console.error("Gönderiler çekilemedi", err);
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
        <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-card-bg/80 border border-accent-purple/40 hover:border-accent-purple shadow-[0_0_20px_rgba(188,19,254,0.1)] rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group flex flex-col items-center justify-center text-center transition-all">
          <div className="absolute top-0 right-0 w-full h-full bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-accent-purple flex items-center justify-center bg-[#0D1117] shadow-[0_0_40px_rgba(188,19,254,0.4)] mb-6 relative z-10 group-hover:scale-105 transition-transform duration-500">
            <span className="text-accent-purple font-black text-6xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase mb-2 relative z-10">{user.name}</h2>
          <div className="text-sm text-neon-cyan uppercase tracking-widest font-bold mb-4 inline-block px-4 py-1.5 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.2)] relative z-10">
            {user.role}
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto relative z-10">
            {user.role === 'DEVELOPER' ? 'Gameveloper ekosisteminde kod paylaşıyor, çözüm üretiyor ve diğer geliştiricilere mentörlük yapıyor.' : 'Oyun dünyasına vizyon katıyor, yeni fikirler üretiyor ve projelere destek veriyor.'}
          </p>
        </div>

        {/* Trust Score Box (Span 1x2) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 bg-[#05070a] border border-neon-cyan/50 hover:border-neon-cyan shadow-[0_0_30px_rgba(0,255,255,0.15)] hover:shadow-[0_0_50px_rgba(0,255,255,0.3)] rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all group">
          <div className="absolute -bottom-10 -right-10 text-neon-cyan/5 group-hover:text-neon-cyan/10 transition-colors">
            <Zap size={180} />
          </div>
          
          <Zap size={48} className="text-neon-cyan mb-4 animate-pulse relative z-10 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
          <h3 className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-2 relative z-10 font-bold">Trust Score</h3>
          <div className="text-7xl font-black text-neon-cyan text-glow-cyan relative z-10">{user.trustScore}</div>
          <p className="text-xs text-neon-cyan/60 mt-4 text-center relative z-10 uppercase tracking-wider">Topluluk <br/> Güvenilirlik Puanı</p>
        </div>

        {/* Stats 1: Solutions (Span 1x1) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-card-bg/60 border border-green-500/30 hover:border-green-500 rounded-3xl p-6 flex flex-col justify-between group transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold">Çözülen<br/>Sorunlar</h3>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
              <Code size={20} />
            </div>
          </div>
          <div className="text-4xl font-black text-green-400 mt-4 shadow-green-500/50 drop-shadow-md">
            {userPosts.length * 3 + 12}
          </div>
        </div>

        {/* Stats 2: Projects (Span 1x1) */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-card-bg/60 border border-yellow-500/30 hover:border-yellow-500 rounded-3xl p-6 flex flex-col justify-between group transition-all">
          <div className="flex justify-between items-start">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest font-bold">Tamamlanan<br/>Projeler</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
              <Target size={20} />
            </div>
          </div>
          <div className="text-4xl font-black text-yellow-500 mt-4 drop-shadow-md">
            {user.role === 'DEVELOPER' ? 4 : 1}
          </div>
        </div>

        {/* Achievements Banner (Span Full Width) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-gradient-to-r from-neon-pink/20 via-[#0D1117] to-accent-purple/20 border border-gray-800 hover:border-neon-pink/50 rounded-3xl p-6 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neon-pink/20 border border-neon-pink flex items-center justify-center text-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.4)]">
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
            {isLoading ? (
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
