"use client";

import { AlertTriangle, Users } from "lucide-react";

export default function PartnersPage() {
  return (
    <>
      {/* ROL BAZLI UYARI BANNER */}
      <div className="bg-neon-pink/10 border border-neon-pink/30 text-neon-pink px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Ortaklık Bul:</strong> Projeleriniz için ekip arkadaşı arayın veya başkalarının projelerine dahil olun. İletişim kurduğunuz geliştiricilerin Trust Score değerlerine dikkat etmeyi unutmayın!</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Ortaklık Bul <span className="text-neon-pink animate-pulse ml-1">_</span></h1>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-neon-pink/10 text-neon-pink border border-neon-pink/50 hover:bg-neon-pink hover:text-white transition-all rounded-md text-sm font-bold">
            <Users size={16} /> İlan Ver
          </button>
        </div>

        <div className="text-center text-gray-500 py-10 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
          <p>Şu an aktif bir ortaklık ilanı bulunmuyor. Kendi projen için ekip arkadaşı aramaya ne dersin?</p>
        </div>
      </div>
    </>
  );
}
