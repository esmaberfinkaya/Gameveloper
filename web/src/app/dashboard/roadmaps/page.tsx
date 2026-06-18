"use client";

import { useState } from "react";
import { AlertTriangle, Map, X } from "lucide-react";

export default function RoadmapsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card-bg border border-theme-accent/50 rounded-xl neon-glow-theme w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
              <h2 className="text-xl font-bold text-theme-accent text-glow-theme flex items-center gap-2">
                <Map size={24} /> Harita Ekle
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-400 mb-4 text-sm">Yol haritası ekleme formu yakında tam sürüme açılacaktır. Şimdilik sistem kapalıdır.</p>
              <div className="flex justify-end">
                 <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-theme-accent/20 text-theme-accent font-bold rounded-md">Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROL BAZLI UYARI BANNER */}

      <div className="bg-theme-accent/10 border border-theme-accent/30 text-theme-accent px-4 py-3 rounded-lg mb-6 flex items-center gap-3 text-sm">
        <AlertTriangle size={18} className="shrink-0" />
        <p><strong>Yol Haritaları (Roadmaps):</strong> Geliştiriciler tarafından hazırlanan öğrenme rehberleri. İlgili teknolojileri veya araçları öğrenirken adım adım neler yapman gerektiğini buradan takip et. Örnek: YouTube linkleri eklendiğinde otomatik video olarak çalışır!</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-2">
          <h1 className="text-2xl font-bold text-gray-200 tracking-wider">Yol Haritaları <span className="text-theme-accent animate-pulse ml-1">_</span></h1>
          
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-theme-accent/10 text-theme-accent border border-theme-accent/50 hover:bg-theme-accent hover:text-black transition-all rounded-md text-sm font-bold">
            <Map size={16} /> Harita Ekle
          </button>

        </div>

        <div className="text-center text-gray-500 py-10 border border-dashed border-gray-800 rounded-xl bg-card-bg/30">
          <p>Henüz bir yol haritası eklenmemiş. Öğrenme serüvenini paylaşarak başkalarına ışık tut!</p>
        </div>
      </div>
    </>
  );
}
