import { CheckCircle2, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SolutionCardProps {
  id: number;
  questionTitle: string;
  content: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}

export default function SolutionCard({ questionTitle, content, createdAt, user }: SolutionCardProps) {
  return (
    <div className="bg-card-bg/80 border border-theme-accent/30 hover:border-theme-accent/70 rounded-xl transition-all duration-300 backdrop-blur-sm neon-glow-theme hover:neon-glow-theme group relative overflow-hidden mb-6 flex flex-col">
      
      {/* Absolute Badge */}
      <div className="absolute top-0 right-0 bg-theme-accent text-black font-bold text-[10px] uppercase tracking-wider px-4 py-1 rounded-bl-lg neon-glow-theme z-10 flex items-center gap-1">
        <CheckCircle2 size={12} /> Çözüm Önerisi
      </div>

      <div className="p-5 md:p-6 space-y-4">
        {/* Answer To */}
        <div className="text-xs text-gray-500 font-medium">
          <span className="text-gray-400">Yanıtlanan Soru:</span> <span className="italic text-gray-300 group-hover:text-theme-accent transition-colors">{questionTitle}</span>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full border border-theme-accent/50 flex items-center justify-center bg-theme-accent/10">
            <span className="text-theme-accent font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-200">{user?.name || "Anonim"}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="uppercase text-[9px] tracking-widest text-theme-accent font-semibold">{user?.role || "DEVELOPER"}</span>
              <span>•</span>
              <span>{new Date(createdAt).toLocaleDateString("tr-TR", {day: "numeric", month: "short"})}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-2">
          <div className="p-4 bg-[#05070a] border border-gray-800 border-l-2 border-l-theme-accent rounded-lg text-sm text-gray-300 custom-markdown-body line-clamp-4 max-h-32 overflow-hidden relative">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#05070a] to-transparent"></div>
          </div>
          <button className="text-theme-accent text-xs font-bold mt-2 hover:underline">Tüm Çözümü Oku...</button>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center gap-6 text-gray-500 text-xs font-medium">
          <button className="flex items-center gap-1.5 hover:text-theme-accent transition-colors group/btn">
            <ThumbsUp size={16} />
            <span>Faydalı (42)</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <MessageSquare size={16} />
            <span>Tartış (3)</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
