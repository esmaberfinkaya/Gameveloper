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
    <div onClick={onClick} className="relative w-full h-[250px] overflow-hidden rounded-xl border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-black/80 flex flex-col justify-end cursor-pointer group">
      
      <img 
        src={displayImage || '/default-placeholder.png'} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover z-0" 
        onError={(e) => e.currentTarget.src = '/default-placeholder.png'} 
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>

      <div className="relative z-20 p-4 w-full flex flex-col gap-2">
        
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full border border-green-500 flex items-center justify-center bg-black">
            <span className="text-green-500 font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">{user?.name || "Anonim"}</div>
            <div className="text-[10px] text-green-400 uppercase tracking-wider">{user?.role || "DEVELOPER"}</div>
          </div>
          <div className="ml-auto text-xs text-gray-400">
            {createdAt ? new Date(createdAt).toLocaleDateString("tr-TR", {day: "numeric", month: "short"}) : ''}
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
          {title}
        </h3>

        <p className="text-xs md:text-sm text-gray-300 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4 text-gray-400">
            <button onClick={handleLike} className="flex items-center gap-1 hover:text-green-400 transition-colors">
              <Star size={16} /> <span className="text-xs">Destekle</span>
            </button>
            <button onClick={handleShare} className="flex items-center gap-1 hover:text-white transition-colors">
              <Share2 size={16} /> <span className="text-xs">Paylaş</span>
            </button>
          </div>

          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-green-500 text-black font-bold uppercase text-xs px-3 py-1.5 rounded hover:bg-green-400 transition-colors"
            >
              İncele <ExternalLink size={14} />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
