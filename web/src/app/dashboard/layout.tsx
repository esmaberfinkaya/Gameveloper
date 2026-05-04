"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageSquarePlus,
  Map,
  Lightbulb,
  LogOut,
  Terminal,
  Zap,
  Menu,
  X,
  Users,
  Activity,
  User
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      router.push("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.trustScore === undefined) {
      parsedUser.trustScore = 0;
    }
    setUser(parsedUser);
  }, [router, pathname]); // Re-check user when pathname changes in case it updated

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neon-cyan text-glow-cyan animate-pulse tracking-widest uppercase">
          Sisteme Bağlanılıyor...
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: "Sorunlar & Akış", href: "/dashboard", icon: MessageSquarePlus, color: "neon-cyan" },
    { name: "Fikir Havuzu", href: "/dashboard/ideas", icon: Lightbulb, color: "accent-purple" },
    { name: "Ortaklık Bul", href: "/dashboard/partners", icon: Users, color: "neon-pink" },
    { name: "Yol Haritaları", href: "/dashboard/roadmaps", icon: Map, color: "green-400" },
    { name: "Profilim", href: "/dashboard/profile", icon: User, color: "accent-purple" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground overflow-hidden" style={{ backgroundImage: 'radial-gradient(ellipse at bottom right, #0D1117 0%, #05070a 100%)' }}>
      
      {/* MOBIL MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col md:hidden">
          <div className="flex justify-end p-6">
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-neon-pink hover:text-white transition-colors">
              <X size={32} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center space-y-8 p-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const mobileColorMap: Record<string, string> = {
                "neon-cyan": isActive ? "text-neon-cyan" : "text-gray-300",
                "accent-purple": isActive ? "text-accent-purple" : "text-gray-300",
                "neon-pink": isActive ? "text-neon-pink" : "text-gray-300",
                "green-400": isActive ? "text-green-400" : "text-gray-300",
              };
              const glowMap: Record<string, string> = {
                "neon-cyan": isActive ? "text-glow-cyan" : "",
                "accent-purple": isActive ? "text-glow-purple" : "",
                "neon-pink": isActive ? "text-glow-pink" : "",
                "green-400": isActive ? "text-glow-green" : "",
              };

              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={"flex items-center gap-4 text-xl transition-colors group " + mobileColorMap[link.color]}
                >
                  <Icon size={24} className={glowMap[link.color]} /> 
                  {link.name}
                </Link>
              )
            })}
            <button onClick={handleLogout} className="mt-12 flex items-center gap-3 px-6 py-3 border border-red-500/50 rounded-full text-red-400 hover:bg-red-500/20 transition-all">
              <LogOut size={20} /> Sistemden Çık
            </button>
          </nav>
        </div>
      )}

      {/* SOL SÜTUN: NAVİGASYON (Desktop) */}
      <aside className="w-64 bg-card-bg border-r border-accent-purple/30 flex-col justify-between shrink-0 relative z-10 hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="h-20 flex items-center justify-center border-b border-accent-purple/30">
            <h2 className="text-xl font-bold tracking-widest text-glow-cyan text-neon-cyan uppercase flex items-center gap-2">
              <Terminal size={24} />
              Gameveloper
            </h2>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-3 mt-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              // We extract the base color (cyan, pink, purple) for dynamic classes where possible, or just hardcode some classes.
              // To avoid tailwind purge issues, it's better to explicitly list classes or use simple mappings.
              const colorMap: Record<string, string> = {
                "neon-cyan": isActive ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan" : "hover:text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/50 text-gray-300 border-transparent",
                "accent-purple": isActive ? "bg-accent-purple/20 text-accent-purple border-accent-purple" : "hover:text-accent-purple hover:bg-accent-purple/10 hover:border-accent-purple/50 text-gray-300 border-transparent",
                "neon-pink": isActive ? "bg-neon-pink/20 text-neon-pink border-neon-pink" : "hover:text-neon-pink hover:bg-neon-pink/10 hover:border-neon-pink/50 text-gray-300 border-transparent",
                "green-400": isActive ? "bg-green-400/20 text-green-400 border-green-400" : "hover:text-green-400 hover:bg-green-400/10 hover:border-green-400/50 text-gray-300 border-transparent",
              };

              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md border transition-all duration-300 group ${colorMap[link.color]}`}
                >
                  <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                  <span className="font-medium tracking-wide">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-accent-purple/30">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-red-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/50 transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="font-medium tracking-wide uppercase text-sm">Sistemden Çık</span>
          </button>
        </div>
      </aside>

      {/* ORTA SÜTUN: İÇERİK */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-20 bg-card-bg/80 backdrop-blur-md border-b border-accent-purple/30 flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-neon-cyan transition-colors">
              <Menu size={28} />
            </button>
            <h2 className="text-xl font-bold tracking-widest text-glow-cyan text-neon-cyan uppercase">
              <Terminal size={20} className="inline mr-2" />
              Gameveloper
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] min-h-screen" style={{ backgroundImage: 'linear-gradient(var(--accent-purple) 1px, transparent 1px), linear-gradient(90deg, var(--accent-purple) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* SAĞ SÜTUN: KULLANICI PANELİ */}
      <aside className="w-80 bg-[#0D1117] border-l border-accent-purple/30 hidden lg:flex flex-col shrink-0">
        
        {/* Kullanıcı Profili ve Trust Score Banner */}
        <div className="p-8 border-b border-gray-800 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="w-24 h-24 rounded-full border-4 border-neon-cyan flex items-center justify-center bg-[#0D1117] neon-glow-cyan shadow-[0_0_30px_rgba(0,255,255,0.4)] mb-4 relative z-10">
            <span className="text-neon-cyan font-bold text-4xl">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          
          <h3 className="text-xl font-bold text-white tracking-wider z-10">{user.name}</h3>
          <div className="text-xs text-accent-purple uppercase tracking-widest font-semibold mt-1 mb-6 z-10">{user.role}</div>

          <div className="bg-card-bg border border-neon-cyan/50 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.2)] flex flex-col items-center justify-center w-full relative z-10">
            <Zap size={24} className="text-neon-cyan mb-2 animate-pulse" />
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-1">Trust Score</span>
            <span className="text-3xl font-black text-neon-cyan text-glow-cyan">{user.trustScore}</span>
          </div>
        </div>

        {/* Son Etkileşimler */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Activity size={16} className="text-neon-pink" />
            Son Etkileşimler
          </h4>
          
          <div className="space-y-4">
            {/* Şimdilik Mock Veri ile Etkileşimler */}
            <div className="bg-card-bg/50 border border-gray-800 p-3 rounded-lg flex items-start gap-3 hover:border-neon-cyan/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-neon-cyan/10 flex items-center justify-center shrink-0 mt-0.5 text-neon-cyan">
                <Zap size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Sorun başarıyla paylaşıldı. Topluluk değerlendirmesi bekleniyor.
                </p>
                <span className="text-[10px] text-gray-500 mt-1 block">Az önce</span>
              </div>
            </div>

            <div className="bg-card-bg/50 border border-gray-800 p-3 rounded-lg flex items-start gap-3 hover:border-accent-purple/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center shrink-0 mt-0.5 text-accent-purple">
                <MessageSquarePlus size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Hesabın başarıyla oluşturuldu. Gameveloper ekosistemine hoş geldin.
                </p>
                <span className="text-[10px] text-gray-500 mt-1 block">Bugün</span>
              </div>
            </div>
            
            <div className="text-center text-[10px] text-gray-600 uppercase tracking-widest pt-4">
              Daha eski veri yok
            </div>
          </div>
        </div>

      </aside>

    </div>
  );
}
