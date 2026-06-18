"use client";

import { useEffect, useState, useRef } from "react";
import { AlertTriangle, Users, X, Send } from "lucide-react";
import io from "socket.io-client";

export default function PartnersPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activePartnership, setActivePartnership] = useState<any>(null);
  const socketRef = useRef<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredRole: "DEVELOPER",
    isUrgent: false
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchPartnerships();
  }, []);

  useEffect(() => {
    if (isChatOpen && activePartnership && !socketRef.current) {
      socketRef.current = io("http://localhost:5000");
      
      socketRef.current.on("connect", () => {
        socketRef.current.emit("join_room", activePartnership.id);
      });
      
      socketRef.current.on("receive_message", (msg: any) => {
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });
      
      fetchMessages();
    }

    return () => {
      if (!isChatOpen && socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setMessages([]);
      }
    };
  }, [isChatOpen, activePartnership]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/partnerships/${activePartnership.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !socketRef.current || !user) return;
    
    socketRef.current.emit("send_message", {
      partnershipId: activePartnership.id,
      senderId: user.id,
      content: newMessage.trim()
    });
    setNewMessage("");
  };


  const fetchPartnerships = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/partnerships");
      if (res.ok) {
        const data = await res.json();
        setPartnerships(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const res = await fetch("http://localhost:5000/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: user.id })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: "", description: "", requiredRole: "DEVELOPER", isUrgent: false });
        fetchPartnerships();
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
      {/* ROL BAZLI UYARI BANNER */}
      <div className="bg-theme-accent/10 border border-theme-accent/30 text-theme-accent px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Ortaklık Bul:</strong> Projeleriniz için ekip arkadaşı arayın veya başkalarının projelerine dahil olun. İletişim kurduğunuz geliştiricilerin Trust Score değerlerine dikkat etmeyi unutmayın!</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Ortaklık Bul <span className="text-theme-accent animate-pulse ml-1">_</span></h1>
          
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-theme-accent/10 text-theme-accent border border-theme-accent/50 hover:bg-theme-accent hover:text-black transition-all rounded-md text-sm font-bold">
            <Users size={16} /> İlan Ver
          </button>
        </div>

        {/* Ekleme Modalı */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-card-bg border border-theme-accent/50 rounded-xl neon-glow-theme w-full max-w-lg overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <h2 className="text-xl font-bold text-theme-accent text-glow-theme flex items-center gap-2">
                  <Users size={24} /> Yeni İlan
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Başlık</label>
                  <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Açıklama</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition resize-none"></textarea>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Aranan Rol</label>
                    <select value={formData.requiredRole} onChange={(e) => setFormData({...formData, requiredRole: e.target.value})} className="w-full bg-[#0D1117] border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition">
                      <option value="DEVELOPER">Geliştirici (Kod)</option>
                      <option value="ARTIST">3D/2D Artist</option>
                      <option value="DESIGNER">Game Designer</option>
                      <option value="MUSICIAN">Müzisyen/Ses</option>
                      <option value="GAMER">Test Kullanıcısı (Gamer)</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                      <input type="checkbox" checked={formData.isUrgent} onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} className="form-checkbox text-theme-accent rounded border-gray-700 bg-[#0D1117]" />
                      Acil İlan (Urgent)
                    </label>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-400 hover:text-white transition font-bold">İptal</button>
                  <button type="submit" className="px-5 py-2 bg-theme-accent text-black font-black rounded-md hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] transition-all">YAYINLA</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dinamik İlanlar */}
        {partnerships.map((p) => (
          <div key={p.id} className="bg-card-bg/80 border border-theme-accent/30 p-6 rounded-xl hover:border-theme-accent/70 hover:neon-glow-theme transition-all flex flex-col gap-4 relative overflow-hidden mb-6">
            {p.isUrgent && <div className="absolute top-0 left-0 w-full h-1 bg-theme-accent neon-glow-theme"></div>}
            
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-theme-accent/10 text-theme-accent text-xs font-bold rounded border border-theme-accent/50">{p.requiredRole} ARANIYOR</span>
                  {p.isUrgent && (
                    <span className="flex items-center gap-1 text-theme-accent text-xs font-bold animate-pulse">
                      <AlertTriangle size={14} /> URGENT
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-white">{p.title}</h2>
                <p className="text-sm text-gray-400 mt-2">{p.description}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-600">
                  {p.user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-white font-bold">{p.user?.name}</p>
                  <p className="text-xs text-theme-accent flex items-center gap-1">
                    Trust Score: {p.user?.trustScore} <span className="text-theme-accent drop-neon-glow-theme">⚡</span>
                  </p>
                </div>
              </div>
              <button onClick={() => { setActivePartnership(p); setIsChatOpen(true); }} className="px-6 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent font-bold rounded hover:bg-theme-accent hover:text-black transition-all neon-glow-theme">
                BAŞVUR
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CHAT DRAWER */}
      {isChatOpen && activePartnership && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsChatOpen(false); setActivePartnership(null); }}></div>
          <div className="relative w-full max-w-md h-full bg-[#05070a] border-l border-theme-accent shadow-[0_0_30px_rgba(0,255,255,0.2)] flex flex-col animate-slide-in-right">
            
            {/* Header */}
            <div className="p-4 border-b border-theme-accent/50 bg-[#0D1117] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-theme-accent/20 border border-theme-accent flex items-center justify-center text-theme-accent font-bold">
                  {activePartnership.user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{activePartnership.title}</h3>
                  <p className="text-theme-accent text-[10px] uppercase tracking-widest flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse"></span> ONLINE
                  </p>
                </div>
              </div>
              <button onClick={() => { setIsChatOpen(false); setActivePartnership(null); }} className="text-gray-400 hover:text-white p-2">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area (Terminal Style) */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-sm space-y-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0D1117] to-[#05070a]">
              <div className="text-center text-gray-600 text-xs my-4 border-b border-gray-800 pb-2">
                &lt; SECURE CONNECTION ESTABLISHED &gt;
              </div>
              
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-xs my-10">
                  Hiç mesaj yok. İlk yazan sen ol!
                </div>
              )}
              
              {messages.map((m: any, idx: number) => {
                const isMe = m.senderId === user?.id;
                return (
                  <div key={idx} className={`flex flex-col gap-1 max-w-[85%] ${isMe ? 'self-end ml-auto' : ''}`}>
                    <span className={`text-[10px] ${isMe ? 'text-theme-accent text-right' : 'text-gray-500'}`}>
                      {m.sender?.name || "Bilinmiyor"} - {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <div className={`p-3 border-2 shadow-[0_0_10px_rgba(0,255,255,0.1)] ${isMe ? 'bg-theme-accent/10 text-theme-accent rounded-l-lg rounded-br-lg border-r-theme-accent' : 'bg-gray-800 text-gray-300 rounded-r-lg rounded-bl-lg border-l-gray-600'}`}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-theme-accent/50 bg-[#0D1117]">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajını yaz terminale..."
                  className="flex-1 bg-black border border-gray-700 focus:border-theme-accent text-theme-accent font-mono text-sm p-3 rounded-md outline-none transition-colors"
                />
                <button type="submit" disabled={!newMessage.trim()} className="bg-theme-accent text-black font-bold px-4 py-2 rounded-md hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
