"use client";

import { useEffect, useState } from "react";
import { User, Zap, Activity, MessageSquare, Heart, Share2, Hexagon } from "lucide-react";
import FeedCard from "@/components/FeedCard";
import IdeaCard from "@/components/IdeaCard";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("shared"); // shared, liked, comments
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
      // Using the explore endpoint and filtering on frontend for prototype
      const res = await fetch(`http://localhost:5000/api/explore?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        const myPosts = data.filter((item: any) => item.userId === userId);
        setUserPosts(myPosts);
      }
    } catch (err) {
      console.error("Gönderiler çekilemedi", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Profile Header */}
      <div className="bg-card-bg/80 border border-gray-800 rounded-2xl p-8 mb-8 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="w-32 h-32 rounded-full border-4 border-accent-purple flex items-center justify-center bg-[#0D1117] shadow-[0_0_40px_rgba(188,19,254,0.3)] shrink-0">
            <span className="text-accent-purple font-bold text-5xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1">{user.name}</h1>
            <div className="text-sm text-neon-cyan uppercase tracking-widest font-bold mb-4 inline-block px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full">
              {user.role}
            </div>
            
            <p className="text-gray-400 text-sm max-w-xl">
              Gameveloper ekosistemine katıldığından beri topluluğa değer katan bir üye. 
              {user.role === 'DEVELOPER' ? ' Uzmanlık alanlarında diğer kullanıcılara yol gösteriyor ve kod paylaşıyor.' : ' Fikirleriyle oyun dünyasına yön veriyor.'}
            </p>
          </div>

          <div className="bg-[#05070a] border border-neon-cyan/30 px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.1)] flex flex-col items-center justify-center min-w-[160px] shrink-0">
            <Zap size={32} className="text-neon-cyan mb-2 animate-pulse" />
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-1">Trust Score</span>
            <span className="text-4xl font-black text-neon-cyan text-glow-cyan">{user.trustScore}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-8">
        <button 
          onClick={() => setActiveTab("shared")}
          className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 ${activeTab === "shared" ? 'text-accent-purple border-b-2 border-accent-purple bg-accent-purple/5' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Share2 size={18} /> Paylaşılanlar
        </button>
        <button 
          onClick={() => setActiveTab("liked")}
          className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 ${activeTab === "liked" ? 'text-neon-pink border-b-2 border-neon-pink bg-neon-pink/5' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Heart size={18} /> Beğenilenler
        </button>
        <button 
          onClick={() => setActiveTab("comments")}
          className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 ${activeTab === "comments" ? 'text-neon-cyan border-b-2 border-neon-cyan bg-neon-cyan/5' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <MessageSquare size={18} /> Yorumlar
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-500 py-10">Yükleniyor...</div>
        ) : activeTab === "shared" ? (
          userPosts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-20 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
              <Hexagon size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Henüz hiçbir içerik paylaşmadın.</p>
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
          )
        ) : (
          <div className="col-span-full text-center text-gray-500 py-20 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
            <Activity size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">Bu sekmedeki veriler yapım aşamasındadır.</p>
          </div>
        )}
      </div>

    </div>
  );
}
