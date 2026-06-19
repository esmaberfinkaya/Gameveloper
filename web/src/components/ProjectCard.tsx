import { Share2, Star, Eye, ExternalLink, Flame } from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  images?: any[];
  link?: string;
  category?: string;
  createdAt?: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
  currentUser?: any;
  onUpdate?: () => void;
  onClick?: () => void;
}

export default function ProjectCard({ id, title, description, imageUrl, images, link, category, createdAt, user, currentUser, onUpdate, onClick }: ProjectCardProps) {
  const displayImage = (images && images.length > 0) ? images[0] : imageUrl;
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
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/dashboard?project=${id}`);
      alert("Proje linki kopyalandı!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div onClick={onClick} className="col-span-full mb-8 rounded-2xl border border-theme-accent/30 hover:border-theme-accent neon-glow-theme hover:neon-glow-theme transition-all duration-500 cursor-pointer h-48 md:h-[220px] w-full overflow-hidden relative flex items-end group">
      
      {/* Dynamic Background Image */}
      {displayImage && (
        <div className="absolute inset-0 relative overflow-hidden w-full h-full">
          <img 
            src={displayImage} 
            alt={title} 
            className="w-full h-full object-cover absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
          />
        </div>
      )}

      {/* Bottom Gradient Overlay for text readability only */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

      {/* Floating Category Badge */}
      <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-theme-accent/50 text-theme-accent text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full neon-glow-theme flex items-center gap-2 animate-pulse">
        <Flame size={16} /> SHOWCASE
      </div>

      {/* Content Area */}
      <div className="relative z-10 w-full p-6 md:p-10 flex flex-col md:flex-row items-end justify-between gap-6">
        
        {/* Left Side: Info */}
        <div className="flex-1 max-w-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full border-2 border-theme-accent flex items-center justify-center bg-[#0D1117] neon-glow-theme">
              <span className="text-theme-accent font-black text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-wider">{user?.name || "Anonim"}</div>
              <div className="flex items-center gap-2 text-xs text-theme-accent/80 mt-1">
                <span className="uppercase tracking-widest font-bold">{user?.role || "DEVELOPER"}</span>
                <span>•</span>
                <span className="text-gray-400">{new Date(createdAt).toLocaleDateString("tr-TR", {day: "numeric", month: "short", year: "numeric"})}</span>
              </div>
            </div>
          </div>

          <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 tracking-wide group-hover:text-theme-accent transition-colors drop-shadow-2xl">
            {title}
          </h3>

          <p className="text-base md:text-lg text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-md">
            {description}
          </p>
        </div>

        {/* Right Side: Actions */}
        <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-auto">
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-theme-accent text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-theme-accent transition-all neon-glow-theme hover:neon-glow-theme hover:-translate-y-1"
            >
              Hemen İncele <ExternalLink size={20} />
            </a>
          )}
          
          <div className="flex items-center gap-6 text-gray-300 font-bold mt-2">
            <button onClick={handleLike} className="flex items-center gap-2 hover:text-theme-accent transition-colors">
              <Star size={24} /> <span className="hidden md:inline">Destekle</span>
            </button>
            <button onClick={handleShare} className="flex items-center gap-2 hover:text-white transition-colors">
              <Share2 size={24} /> <span className="hidden md:inline">Paylaş</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
