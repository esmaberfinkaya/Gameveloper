import { useState } from "react";
import { MessageSquarePlus, Share2, Lock, Unlock, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IdeaCardProps {
  id: number;
  title: string;
  story: string;
  visuals: string;
  gameplay: string;
  category: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    role: string;
    trustScore: number;
  };
  comments: any[];
  currentUser: any;
  onUpdate: () => void;
  isExplore?: boolean;
}

export default function IdeaCard({ id, title, story, visuals, gameplay, category, createdAt, user, comments, currentUser, onUpdate, isExplore = false }: IdeaCardProps) {
  const [activeTab, setActiveTab] = useState<"STORY" | "VISUALS" | "GAMEPLAY">("STORY");
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ideas/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentContent,
          isPrivate,
          userId: currentUser?.id
        })
      });

      if (res.ok) {
        setCommentContent("");
        setIsPrivate(false);
        onUpdate();
      } else {
        const error = await res.json();
        alert(error.error || "Yorum gönderilemedi.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card-bg/80 border border-gray-800 hover:border-theme-accent/50 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg group relative overflow-hidden mb-6">
      
      {/* Category Badge Top Right */}
      <div className="absolute top-4 right-4 bg-gray-900 border border-gray-700 text-gray-300 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full group-hover:border-theme-accent/50 group-hover:text-theme-accent transition-colors z-10">
        {category}
      </div>

      <div className="p-5 md:p-6 space-y-4">
        {/* Author Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center bg-[#0D1117] relative">
            <span className="text-gray-300 font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-200">{user?.name || "Anonim"}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="uppercase text-[9px] tracking-widest text-theme-accent font-semibold">{user?.role || "GAMER"}</span>
              <span>•</span>
              <span>{new Date(createdAt).toLocaleDateString("tr-TR", {day: "numeric", month: "short"})}</span>
            </div>
          </div>
        </div>

        <h3 className={`text-xl font-bold text-white group-hover:text-glow-theme transition-colors ${isExplore ? 'truncate' : ''}`}>{title}</h3>

        {/* IDEA TABS: Hikaye, Görüntü, Oynanış */}
        <div className="pt-2 border border-gray-800 rounded-lg overflow-hidden bg-[#05070a]">
          {!isExplore && (
            <div className="flex border-b border-gray-800">
              <button 
                onClick={() => setActiveTab("STORY")}
                className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeTab === "STORY" ? 'text-theme-accent border-b-2 border-theme-accent bg-theme-accent/5' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Hikaye
              </button>
              <button 
                onClick={() => setActiveTab("VISUALS")}
                className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeTab === "VISUALS" ? 'text-theme-accent border-b-2 border-theme-accent bg-theme-accent/5' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Görüntü
              </button>
              <button 
                onClick={() => setActiveTab("GAMEPLAY")}
                className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase transition-all ${activeTab === "GAMEPLAY" ? 'text-theme-accent border-b-2 border-theme-accent bg-theme-accent/5' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Oynanış
              </button>
            </div>
          )}
          
          <div className={`p-4 text-sm text-gray-300 custom-markdown-body ${isExplore ? 'line-clamp-3 max-h-20 overflow-hidden' : 'min-h-[100px]'}`}>
            {isExplore ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{story || visuals || gameplay}</ReactMarkdown>
            ) : (
              <>
                {activeTab === "STORY" && <ReactMarkdown remarkPlugins={[remarkGfm]}>{story}</ReactMarkdown>}
                {activeTab === "VISUALS" && <ReactMarkdown remarkPlugins={[remarkGfm]}>{visuals}</ReactMarkdown>}
                {activeTab === "GAMEPLAY" && <ReactMarkdown remarkPlugins={[remarkGfm]}>{gameplay}</ReactMarkdown>}
              </>
            )}
          </div>
        </div>

        {isExplore && (
           <button className="text-theme-accent text-xs font-bold mt-2 hover:underline">Fikri İncele...</button>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex items-center gap-6 text-gray-500 text-xs font-medium mt-4">
          <button 
            onClick={() => setIsCommentsExpanded(!isCommentsExpanded)}
            className={`flex items-center gap-1.5 transition-colors group/btn ${isCommentsExpanded ? 'text-theme-accent' : 'hover:text-theme-accent'}`}
          >
            <MessageSquarePlus size={16} className="group-hover/btn:text-glow-theme" />
            <span>Tartışmalar ({comments.length})</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-theme-accent transition-colors group/btn">
            <Share2 size={16} className="group-hover/btn:text-glow-theme" />
            <span>Paylaş</span>
          </button>
        </div>
      </div>

      {/* COMMENTS SECTION (with isPrivate logic) */}
      {isCommentsExpanded && (
        <div className="bg-[#05070a] border-t border-gray-800 p-5 space-y-6">
          <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {comments.length === 0 ? (
              <div className="text-center text-gray-600 text-xs py-4">Henüz yorum yapılmamış. Fikre katkıda bulun!</div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className={`p-3 rounded-lg border ${c.isPrivate ? 'border-theme-accent/50 bg-theme-accent/5' : 'border-gray-800/50 bg-[#0D1117]'} relative`}>
                  {c.isPrivate && (
                    <div className="absolute top-2 right-2 text-theme-accent flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold">
                      <EyeOff size={12} /> Gizli Yorum
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-300 text-xs">{c.user?.name}</span>
                    <span className="text-[8px] bg-gray-800 text-gray-400 px-1 rounded">{c.user?.role}</span>
                  </div>
                  <div className={`text-xs ${c.isPrivate ? 'text-theme-accent/90 font-medium' : 'text-gray-400'}`}>
                    {c.content}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="pt-4 border-t border-gray-800 flex flex-col gap-3">
            <textarea 
              required
              rows={2}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Fikir hakkında ne düşünüyorsun?"
              className="w-full bg-background border border-gray-700 focus:border-theme-accent focus:ring-1 focus:ring-theme-accent rounded-md p-3 text-sm text-white resize-none"
            />
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                <input 
                  type="checkbox" 
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 text-theme-accent focus:ring-theme-accent bg-[#0D1117]"
                />
                {isPrivate ? <Lock size={14} className="text-theme-accent" /> : <Unlock size={14} />}
                Gizli Yorum (Sadece sen ve fikir sahibi görür)
              </label>
              <button disabled={isSubmitting} className="bg-theme-accent/20 text-theme-accent border border-theme-accent hover:bg-theme-accent hover:text-white px-4 py-2 rounded-md text-xs font-bold transition-all">
                {isSubmitting ? "Gönderiliyor..." : "Yorum Gönder"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
