"use client";

import { AlertTriangle, Users } from "lucide-react";

export default function PartnersPage() {
  return (
    <>
      {/* ROL BAZLI UYARI BANNER */}
      <div className="bg-theme-accent/10 border border-theme-accent/30 text-theme-accent px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Ortaklık Bul:</strong> Projeleriniz için ekip arkadaşı arayın veya başkalarının projelerine dahil olun. İletişim kurduğunuz geliştiricilerin Trust Score değerlerine dikkat etmeyi unutmayın!</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Ortaklık Bul <span className="text-theme-accent animate-pulse ml-1">_</span></h1>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-accent/10 text-theme-accent border border-theme-accent/50 hover:bg-theme-accent hover:text-white transition-all rounded-md text-sm font-bold">
            <Users size={16} /> İlan Ver
          </button>
        </div>

        {/* MOCK DATA: URGENT Partnership from BlenderMaster */}
        <div className="bg-card-bg/80 border border-theme-accent/50 p-6 rounded-xl neon-glow-theme hover:neon-glow-theme transition-all flex flex-col gap-4 relative overflow-hidden">
          {/* Urgent Glow Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-theme-accent neon-glow-theme"></div>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-theme-accent/20 text-theme-accent text-xs font-bold rounded border border-theme-accent neon-glow-theme">3D ARTIST ARANIYOR</span>
                <span className="flex items-center gap-1 text-theme-accent text-xs font-bold animate-pulse">
                  <AlertTriangle size={14} /> URGENT
                </span>
              </div>
              <h2 className="text-xl font-black text-white">Sci-Fi Çevre Tasarımı İçin Yardım</h2>
              <p className="text-sm text-gray-400 mt-2">
                Unity HDRP kullanarak geliştirdiğim projede sci-fi koridor ve dış mekan modellemeleri yapacak bir 3D artist arıyorum.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-end mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-600">
                B
              </div>
              <div>
                <p className="text-sm text-white font-bold">BlenderMaster</p>
                <p className="text-xs text-theme-accent flex items-center gap-1">
                  Trust Score: 2450 <span className="text-theme-accent drop-neon-glow-theme">⚡</span>
                </p>
              </div>
            </div>
            
            <button className="px-6 py-2 bg-theme-accent/20 text-theme-accent border border-theme-accent font-bold rounded hover:bg-theme-accent hover:text-black transition-all neon-glow-theme">
              BAŞVUR
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
