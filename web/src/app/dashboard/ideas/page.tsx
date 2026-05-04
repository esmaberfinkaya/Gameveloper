"use client";

import { AlertTriangle, Lightbulb } from "lucide-react";

export default function IdeasPage() {
  return (
    <>
      {/* ROL BAZLI UYARI BANNER */}
      <div className="bg-accent-purple/10 border border-accent-purple/30 text-accent-purple px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Fikir Havuzu:</strong> Geliştiriciler oyun mekanikleri ve teknik fikirlerini paylaşır. Tüm tartışmalar telif hakkı korkusu olmadan yapılabilir. Fikirler "Private" olarak işaretlenirse sadece yazar ve mentörler arasında kalır.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Fikir Havuzu <span className="text-accent-purple animate-pulse ml-1">_</span></h1>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-accent-purple/10 text-accent-purple border border-accent-purple/50 hover:bg-accent-purple hover:text-white transition-all rounded-md text-sm font-bold">
            <Lightbulb size={16} /> Fikir Paylaş
          </button>
        </div>

        <div className="text-center text-gray-500 py-10 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
          <p>Henüz fikir paylaşılmamış. İlk parlak fikrini sen paylaş!</p>
        </div>
      </div>
    </>
  );
}
