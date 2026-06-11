import { Share2, Star, Eye, ExternalLink, Flame } from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}

export default function ProjectCard({ title, description, imageUrl, link, category, createdAt, user }: ProjectCardProps) {
  return (
    <div className="col-span-full mb-8 relative group overflow-hidden rounded-2xl border border-theme-accent/30 hover:border-theme-accent neon-glow-theme hover:neon-glow-theme transition-all duration-500 min-h-[400px] flex items-end">
      
      {/* Dynamic Background Image */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 to-black w-full h-full flex items-center justify-center">
          <Star size={120} className="text-theme-accent/10" />
        </div>
      )}

      {/* Heavy Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      <div className="absolute inset-0 bg-theme-accent/10 mix-blend-overlay group-hover:bg-theme-accent/20 transition-all duration-500"></div>

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
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-theme-accent text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-theme-accent transition-all neon-glow-theme hover:neon-glow-theme hover:-translate-y-1"
            >
              Hemen İncele <ExternalLink size={20} />
            </a>
          )}
          
          <div className="flex items-center gap-6 text-gray-300 font-bold mt-2">
            <button className="flex items-center gap-2 hover:text-theme-accent transition-colors">
              <Star size={24} /> <span className="hidden md:inline">Destekle</span>
            </button>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Share2 size={24} /> <span className="hidden md:inline">Paylaş</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
