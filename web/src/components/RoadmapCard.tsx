import { useState } from "react";
import { Map, ArrowRight, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";

interface RoadmapCardProps {
  id: number;
  title: string;
  description: string;
  steps?: { title: string; content: string }[];
  user: {
    id: number;
    name: string;
    role: string;
  };
}

export default function RoadmapCard({ title, description, steps = [], user }: RoadmapCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openStepIndex, setOpenStepIndex] = useState<number | null>(null);

  const toggleStep = (index: number) => {
    setOpenStepIndex(openStepIndex === index ? null : index);
  };

  return (
    <div className="bg-card-bg/80 border border-theme-accent/30 hover:border-theme-accent/70 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg group relative overflow-hidden mb-6">
      
      {/* Background Graphic */}
      <div className="absolute -right-6 -top-6 text-theme-accent/5 group-hover:text-theme-accent/10 transition-colors pointer-events-none">
        <Map size={160} strokeWidth={1} />
      </div>

      <div className="p-5 md:p-6 space-y-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="bg-theme-accent/10 text-theme-accent border border-theme-accent/30 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5">
            <Map size={12} /> Yol Haritası
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1 font-bold">{steps?.length || 0} Adım</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white group-hover:text-theme-accent transition-colors">{title}</h3>
        
        <p className="text-sm text-gray-400 line-clamp-2">
          {description}
        </p>

        {/* Accordion Steps */}
        {isExpanded && steps && steps.length > 0 && (
          <div className="mt-6 space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-800 rounded-lg overflow-hidden bg-[#0a0a0f]">
                <button 
                  onClick={() => toggleStep(index)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-[#12121a] hover:bg-theme-accent/10 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-theme-accent/20 text-theme-accent flex items-center justify-center text-xs font-bold border border-theme-accent/50">
                      {index + 1}
                    </div>
                    <span className="font-bold text-gray-200">{step.title}</span>
                  </div>
                  {openStepIndex === index ? <ChevronUp size={16} className="text-theme-accent" /> : <ChevronDown size={16} className="text-gray-500" />}
                </button>
                {openStepIndex === index && (
                  <div className="px-4 py-4 border-t border-gray-800 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {step.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
          <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center bg-[#0D1117]">
            <span className="text-gray-300 font-bold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-300">{user?.name || "Anonim"}</span>
              <span className="text-[9px] uppercase tracking-widest text-theme-accent font-semibold">{user?.role || "DEVELOPER"}</span>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-bold text-theme-accent hover:text-theme-accent transition-colors"
            >
              {isExpanded ? 'Gizle' : 'İncele'} <ArrowRight size={14} className={`group-hover:translate-x-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
