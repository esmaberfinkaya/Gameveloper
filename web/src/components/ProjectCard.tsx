import { Share2, Star, Eye, ExternalLink, Flame } from "lucide-react";
import { useState } from "react";
import ShareModal from "./ShareModal";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  images?: any[];
  link?: string;
  category?: string;
  createdAt?: string;
  project?: any;
  author?: any;
  currentUser?: any;
  user?: {
    id: number;
    name: string;
    role?: string;
  };
  onUpdate?: () => void;
  onClick?: () => void;
}

export default function ProjectCard({ id, title, description, imageUrl, images, link, category, createdAt, project, user, author, currentUser, onUpdate, onClick }: ProjectCardProps) {
  const displayImage = (images && images.length > 0) ? images[0] : imageUrl;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, projectId: id })
      });
      if (res.ok && onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  return (
    <>
    <div onClick={onClick} className="bg-card-bg/80 border border-theme-accent/30 hover:border-theme-accent rounded-xl p-5 md:p-6 transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.05)] hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] group relative overflow-hidden mb-6 cursor-pointer flex flex-col justify-between min-h-[180px]">
      
      {/* Category Badge Top Right */}
      <div className="absolute top-4 right-4 bg-gray-900 border border-theme-accent/30 text-theme-accent text-[10px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 z-10 animate-pulse">
        <Flame size={12} /> PROJE
      </div>

      <div className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-theme-accent flex items-center justify-center bg-black">
            <span className="text-theme-accent font-bold text-lg">{(project?.user?.name || project?.author?.name || author?.name || user?.name || 'G').charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">{project?.user?.name || project?.author?.name || author?.name || user?.name || 'Geliştirici'}</div>
            <div className="flex items-center gap-2 text-[10px] text-theme-accent/80 uppercase tracking-widest mt-0.5">
              <span>{project?.user?.role || project?.author?.role || author?.role || user?.role || "DEVELOPER"}</span>
              <span>•</span>
              <span className="text-gray-500">{createdAt ? new Date(createdAt).toLocaleDateString("tr-TR", {day: "numeric", month: "short", year: "numeric"}) : ''}</span>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2 group-hover:text-theme-accent transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Actions and Meta */}
      <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Interaction Actions */}
        <div className="flex items-center gap-4 text-gray-400">
          <button onClick={handleLike} className="flex items-center gap-1.5 hover:text-theme-accent transition-colors">
            <Star size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Destekle</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Share2 size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Paylaş</span>
          </button>
        </div>

        {/* Link Actions */}
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noreferrer" 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 bg-theme-accent/10 border border-theme-accent text-theme-accent font-bold uppercase tracking-widest text-[10px] md:text-xs px-4 py-2 rounded-md hover:bg-theme-accent hover:text-black transition-colors shrink-0"
          >
            Hemen İncele <ExternalLink size={14} />
          </a>
        )}
      </div>

    </div>
    
    {isShareModalOpen && (
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        itemTitle={title} 
        itemLink={`${window.location.origin}/dashboard?project=${id}`} 
      />
    )}
    </>
  );
}
