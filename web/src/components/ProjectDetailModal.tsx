import React from 'react';
import { X, PlayCircle, Store, Heart, Share2 } from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export default function ProjectDetailModal({ isOpen, onClose, project }: ProjectDetailModalProps) {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0f] border border-theme-accent/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(var(--theme-accent),0.2)]">
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur z-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            {project.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-theme-accent transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="p-6">
          {project.images && (
            <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6 border border-gray-800">
              <img src={project.images} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-sm font-bold text-theme-accent uppercase tracking-widest mb-3">Proje Özeti</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{project.summary}</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {project.youtubeUrl && (
              <a 
                href={project.youtubeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                <PlayCircle size={20} /> Videoyu İzle
              </a>
            )}
            {project.storeUrl && (
              <a 
                href={project.storeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#1e293b] hover:bg-[#334155] text-white font-bold uppercase tracking-wider rounded-lg transition-colors border border-gray-700"
              >
                <Store size={20} /> Mağazaya Git
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
