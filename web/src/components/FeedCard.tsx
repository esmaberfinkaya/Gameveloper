import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageSquarePlus, ThumbsUp, Share2, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Lock, X, MessageCircle } from "lucide-react";
import AccessGate from "./AccessGate";

interface FeedCardProps {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  createdAt: string;
  isResolved?: boolean;
  user: {
    id: number;
    name: string;
    role: string;
    trustScore: number;
  };
  responses?: any[];
  currentUser?: any;
  onUpdate?: () => void;
  isExplore?: boolean;
}

export default function FeedCard({ id, title, content, category, imageUrl, createdAt, isResolved, user, responses = [], currentUser, onUpdate, isExplore = false }: FeedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"SOLUTION" | "COMMENT">("SOLUTION");
  const [responseContent, setResponseContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const safeResponses = responses || [];
  const solutions = safeResponses.filter((r) => r.type === "SOLUTION");
  const comments = safeResponses.filter((r) => r.type === "COMMENT");

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/questions/${id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: responseContent,
          type: activeTab,
          userId: currentUser?.id
        })
      });

      if (res.ok) {
        setResponseContent("");
        if (onUpdate) onUpdate();
      } else {
        const error = await res.json();
        alert(error.error || "Yanıt gönderilemedi.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptSolution = async (responseId: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/questions/${id}/responses/${responseId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser?.id })
      });

      if (res.ok) {
        if (onUpdate) onUpdate();
      } else {
        const error = await res.json();
        alert(error.error || "Çözüm onaylanamadı.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, postId: id })
      });
      if (res.ok && onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/dashboard?post=${id}`);
      alert("Link kopyalandı!");
    } catch (err) {
      console.error(err);
    }
  };

  const openDM = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-dm', { detail: user }));
  };

  return (
    <div className={`bg-card-bg/80 border ${isResolved ? 'border-theme-accent/40' : 'border-gray-800'} hover:border-theme-accent/50 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:neon-glow-theme group relative overflow-hidden`}>
      
      {/* SOLVED Badge Top Left */}
      {isResolved && (
        <div className="absolute top-0 left-0 bg-theme-accent text-black text-[10px] font-bold px-3 py-1 rounded-br-lg z-10 flex items-center gap-1 neon-glow-theme">
          <CheckCircle2 size={12} />
          SOLVED
        </div>
      )}

      <div className="p-5 md:p-6 space-y-4">
        {/* Category Badge Top Right */}
        <div className="absolute top-4 right-4 bg-gray-900 border border-gray-700 text-gray-300 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full group-hover:border-theme-accent/50 group-hover:text-theme-accent transition-colors z-10">
          {category}
        </div>

        {/* Author Info */}
        <div className={`flex items-center gap-3 ${isResolved ? 'mt-4' : ''}`}>
          <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center bg-[#0D1117] relative">
            <span className="text-gray-300 font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
            {user?.trustScore > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-theme-accent text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full neon-glow-theme border border-[#0D1117]">
                TS: {user.trustScore}
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-between items-start">
            <div>
              <div className="text-sm font-bold text-gray-200">{user?.name || "Anonim"}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="uppercase text-[9px] tracking-widest text-theme-accent font-semibold">{user?.role || "GAMER"}</span>
                <span>•</span>
                <span>{new Date(createdAt).toLocaleDateString("tr-TR", {day: "numeric", month: "short", hour: "2-digit", minute:"2-digit"})}</span>
              </div>
            </div>
            {currentUser && currentUser.id !== user?.id && (
              <button 
                onClick={openDM}
                className="text-gray-400 hover:text-theme-accent transition-colors p-2 rounded-full hover:bg-theme-accent/10 border border-transparent hover:border-theme-accent/30"
                title="Mesaj Gönder"
              >
                <MessageCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Question Content - Clickable to open modal */}
        <div className="pt-2 cursor-pointer" onClick={() => setIsDetailModalOpen(true)}>
          <h3 className={`text-lg font-bold text-white mb-2 group-hover:text-glow-theme transition-colors pr-20 ${isExplore ? 'truncate' : ''}`}>{title}</h3>
          
          <div className={`text-gray-300 text-sm leading-relaxed custom-markdown-body space-y-3 ${isExplore ? 'line-clamp-3 overflow-hidden max-h-20' : ''}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </div>
          {isExplore && (
             <button className="text-theme-accent text-xs font-bold mt-2 hover:underline">Devamını Oku...</button>
          )}

          {/* Optional Image */}
          {imageUrl && !isExplore && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-800 relative group-hover:border-theme-accent/30 transition-colors max-h-96">
              <img src={imageUrl} alt="İçerik görseli" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        
        {/* DETAIL MODAL */}
        {isDetailModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-[#05070a] border border-theme-accent/50 rounded-xl neon-glow-theme w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
              <div className="p-5 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#05070a]/90 backdrop-blur-sm z-10">
                <h2 className="text-xl font-bold text-white truncate pr-4">{title}</h2>
                <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* ONAYLANMIŞ ÇÖZÜM */}
                {isResolved && solutions.some(s => s.isAccepted) && (
                  <div className="border border-green-500 bg-green-500/10 p-4 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <h4 className="text-green-400 font-bold flex items-center gap-2 mb-3">
                      <CheckCircle2 size={18} /> ✅ ONAYLANMIŞ ÇÖZÜM
                    </h4>
                    {solutions.filter(s => s.isAccepted).map(res => (
                       <div key={res.id} className="text-sm text-gray-200 custom-markdown-body">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>{res.content}</ReactMarkdown>
                       </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-theme-accent/20 text-theme-accent px-2 py-1 rounded text-xs font-bold">{category}</span>
                  <span className="text-gray-400 text-xs">Gönderen: {user?.name} ({user?.role})</span>
                </div>
                
                <div className="text-gray-300 text-sm leading-relaxed custom-markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
                
                {imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-gray-800">
                    <img src={imageUrl} alt="Hata Görseli" className="w-full object-contain max-h-[60vh]" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Modüler Alt Butonlar (Beğen, Çözümler & Yorumlar, Paylaş) */}
        <div className="pt-4 flex items-center gap-6 text-gray-500 text-xs font-medium border-t border-gray-800/50 mt-4">
          <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-theme-accent transition-colors group/btn">
            <ThumbsUp size={16} className="group-hover/btn:text-glow-theme" />
            <span>Beğen</span>
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 transition-colors group/btn ${isExpanded ? 'text-theme-accent' : 'hover:text-theme-accent'}`}
          >
            <MessageSquarePlus size={16} className="group-hover/btn:text-glow-theme" />
            <span>Çözümler & Yorumlar ({safeResponses.length})</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-theme-accent transition-colors group/btn">
            <Share2 size={16} className="group-hover/btn:text-glow-theme" />
            <span>Paylaş</span>
          </button>
        </div>
      </div>

      {/* EXPANDED SECTION: RESPONSES */}
      {isExpanded && (
        <div className="bg-[#05070a] border-t border-gray-800">
          
          {/* TABS */}
          <div className="flex border-b border-gray-800">
            <button 
              onClick={() => setActiveTab("SOLUTION")}
              className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 ${activeTab === "SOLUTION" ? 'text-theme-accent border-b-2 border-theme-accent bg-theme-accent/5' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Çözüm Önerileri <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">{solutions.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab("COMMENT")}
              className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase transition-all flex justify-center items-center gap-2 ${activeTab === "COMMENT" ? 'text-theme-accent border-b-2 border-theme-accent bg-theme-accent/5' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Yorumlar <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-0.5 rounded-full">{comments.length}</span>
            </button>
          </div>

          <div className="p-5 space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
            
            {/* SOLUTION TAB CONTENT */}
            {activeTab === "SOLUTION" && (
              <>
                {/* List Solutions */}
                <div className="space-y-4">
                  {solutions.length === 0 ? (
                    <div className="text-center text-gray-600 text-xs py-4">Henüz çözüm önerisi sunulmamış.</div>
                  ) : (
                    solutions.map((res) => (
                      <div key={res.id} className={`p-4 rounded-xl border ${res.isAccepted ? 'bg-theme-accent/10 border-theme-accent neon-glow-theme' : 'bg-[#0D1117] border-gray-800'} relative`}>
                        {res.isAccepted && (
                          <div className="absolute -top-3 -right-3 bg-theme-accent text-black p-1 rounded-full neon-glow-theme">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-300 text-sm">{res.user?.name}</span>
                            <span className="text-[9px] bg-theme-accent/20 text-theme-accent px-1.5 rounded">{res.user?.role}</span>
                            <span className="text-xs text-gray-600">• TS: {res.user?.trustScore}</span>
                          </div>
                          
                          {/* Accept Button for Author */}
                          {currentUser?.id === user.id && !isResolved && !res.isAccepted && (
                            <button 
                              onClick={() => handleAcceptSolution(res.id)}
                              className="text-[10px] bg-theme-accent/20 text-theme-accent border border-theme-accent/50 hover:bg-theme-accent hover:text-black px-2 py-1 rounded transition-all font-bold tracking-wider flex items-center gap-1"
                            >
                              <CheckCircle2 size={12} /> Onayla
                            </button>
                          )}
                        </div>
                        {/* Markdown supported solution content */}
                        <div className="text-sm text-gray-300 custom-markdown-body">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{res.content}</ReactMarkdown>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Solution Form */}
                {isResolved ? (
                  <div className="bg-theme-accent/5 border border-theme-accent/20 text-theme-accent p-3 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Bu sorunun çözümü onaylanmış ve kapatılmıştır.
                  </div>
                ) : (
                  <AccessGate allowedRoles={["DEVELOPER"]}>
                    <form onSubmit={handleSubmitResponse} className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span>Çözüm Önerisi Sun (Markdown Destekli)</span>
                        <span className="text-theme-accent">Kod: ``` </span>
                      </div>
                      <textarea 
                        required
                        value={responseContent}
                        onChange={(e) => setResponseContent(e.target.value)}
                        placeholder="Teknik detayları ve kodları paylaşarak çözümü yaz..."
                        className="w-full bg-background border border-gray-700 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent rounded-md p-3 text-sm text-white resize-none custom-scrollbar font-mono"
                        rows={4}
                      />
                      <div className="flex justify-end">
                        <button disabled={isSubmitting} className="bg-theme-accent/20 text-theme-accent border border-theme-accent hover:bg-theme-accent hover:text-black px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2">
                          {isSubmitting ? "Gönderiliyor..." : "Çözüm Gönder"}
                        </button>
                      </div>
                    </form>
                  </AccessGate>
                )}
              </>
            )}

            {/* COMMENT TAB CONTENT */}
            {activeTab === "COMMENT" && (
              <>
                {/* List Comments */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center text-gray-600 text-xs py-4">Henüz yorum yapılmamış. İlk yorumu sen yap!</div>
                  ) : (
                    comments.map((res) => (
                      <div key={res.id} className="p-3 border-b border-gray-800/50 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-300 text-xs">{res.user?.name}</span>
                          <span className="text-[8px] bg-gray-800 text-gray-400 px-1 rounded">{res.user?.role}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {res.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Submit Comment Form */}
                <form onSubmit={handleSubmitResponse} className="mt-4 pt-4 border-t border-gray-800 flex gap-2">
                  <input 
                    required
                    type="text"
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                    placeholder="Düşünceni paylaş (Düz Metin)..."
                    className="flex-1 bg-background border border-gray-700 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent rounded-md px-3 py-2 text-sm text-white"
                  />
                  <button disabled={isSubmitting} className="bg-theme-accent/20 text-theme-accent border border-theme-accent hover:bg-theme-accent hover:text-black px-4 py-2 rounded-md text-xs font-bold transition-all">
                    Gönder
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
