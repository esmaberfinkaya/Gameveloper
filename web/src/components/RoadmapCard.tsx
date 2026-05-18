import { Map, ArrowRight, Layers, Clock } from "lucide-react";

interface RoadmapCardProps {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}

export default function RoadmapCard({ title, description, level, duration, createdAt, user }: RoadmapCardProps) {
  return (
    <div className="bg-card-bg/80 border border-blue-500/30 hover:border-blue-500/70 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg group relative overflow-hidden mb-6">
      
      {/* Background Graphic */}
      <div className="absolute -right-6 -top-6 text-blue-500/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
        <Map size={160} strokeWidth={1} />
      </div>

      <div className="p-5 md:p-6 space-y-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
            <Map size={12} /> Yol Haritası
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1"><Layers size={14} /> {level}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {duration}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
        
        <p className="text-sm text-gray-400 line-clamp-2">
          {description}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center bg-[#0D1117]">
            <span className="text-gray-300 font-bold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-300">{user?.name || "Anonim"}</span>
              <span className="text-[9px] uppercase tracking-widest text-blue-500 font-semibold">{user?.role || "DEVELOPER"}</span>
            </div>
            <button className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
              İncele <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
