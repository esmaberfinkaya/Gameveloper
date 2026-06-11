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

  const getThemeAccent = (path: string) => {
    if (path.includes("/dashboard/ideas")) return "#f7ef02";
    if (path.includes("/dashboard/profile")) return "#e00202";
    if (path.includes("/dashboard/partners")) return "#fc03cf";
    if (path.includes("/dashboard/roadmaps")) return "#0505e3";
    return "#03fc1c";
  };

  const themeAccent = getThemeAccent(pathname);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-theme-accent text-glow-theme animate-pulse tracking-widest uppercase">
          Sisteme Bağlanılıyor...
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: "Sorunlar & Akış", href: "/dashboard", icon: MessageSquarePlus },
    { name: "Fikir Havuzu", href: "/dashboard/ideas", icon: Lightbulb },
    { name: "Ortaklık Bul", href: "/dashboard/partners", icon: Users },
    { name: "Yol Haritaları", href: "/dashboard/roadmaps", icon: Map },
    { name: "Profilim", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div 
      className="min-h-screen bg-background flex flex-col md:flex-row text-foreground overflow-hidden transition-colors duration-500" 
      style={{ 
        backgroundImage: 'radial-gradient(ellipse at bottom right, #0D1117 0%, #05070a 100%)',
        '--theme-accent': themeAccent 
      } as React.CSSProperties}
    >
      
      {/* MOBIL MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col md:hidden">
          <div className="flex justify-end p-6">
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-theme-accent hover:text-white transition-colors">
              <X size={32} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col items-center justify-center space-y-8 p-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const mobileActiveClasses = isActive ? "text-theme-accent text-glow-theme" : "text-gray-300";

              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 text-xl transition-colors group ${mobileActiveClasses}`}
                >
                  <Icon size={24} /> 
                  {link.name}
                </Link>
              )
            })}
            <button onClick={handleLogout} className="mt-12 flex items-center gap-3 px-6 py-3 border border-theme-accent/50 rounded-full text-theme-accent hover:bg-theme-accent/20 transition-all">
              <LogOut size={20} /> Sistemden Çık
            </button>
          </nav>
        </div>
      )}

      {/* SOL SÜTUN: NAVİGASYON (Desktop) */}
      <aside className="w-64 bg-card-bg border-r border-theme-accent/30 flex-col justify-between shrink-0 relative z-10 hidden md:flex transition-colors duration-500">
        <div>
          {/* Logo Area */}
          <div className="h-20 flex items-center justify-center border-b border-theme-accent/30 transition-colors duration-500">
            <h2 className="text-xl font-bold tracking-widest text-glow-theme text-theme-accent uppercase flex items-center gap-2 transition-colors duration-500">
              <Terminal size={24} />
              Gameveloper
            </h2>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-3 mt-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const activeClasses = isActive 
                ? "bg-theme-accent/20 text-theme-accent border-theme-accent" 
                : "hover:text-theme-accent hover:bg-theme-accent/10 hover:border-theme-accent/50 text-gray-300 border-transparent";

              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md border transition-all duration-300 group ${activeClasses}`}
                >
                  <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
                  <span className="font-medium tracking-wide">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-theme-accent/30">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-theme-accent hover:text-white hover:bg-theme-accent/20 border border-transparent hover:border-theme-accent/50 transition-all duration-300"
          >
            <LogOut size={18} />
            <span className="font-medium tracking-wide uppercase text-sm">Sistemden Çık</span>
          </button>
        </div>
      </aside>

      {/* ORTA SÜTUN: İÇERİK */}
      <main className="flex-1 w-full lg:w-[65%] flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-20 bg-card-bg/80 backdrop-blur-md border-b border-theme-accent/30 flex items-center justify-between px-6 shrink-0 relative z-10 transition-colors duration-500">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-theme-accent transition-colors">
              <Menu size={28} />
            </button>
            <h2 className="text-xl font-bold tracking-widest text-glow-theme text-theme-accent uppercase transition-colors duration-500">
              <Terminal size={20} className="inline mr-2" />
              Gameveloper
            </h2>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] min-h-screen transition-all duration-500" style={{ backgroundImage: 'linear-gradient(var(--theme-accent) 1px, transparent 1px), linear-gradient(90deg, var(--theme-accent) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* SAĞ SÜTUN: KULLANICI PANELİ */}
      <aside className="w-[15%] bg-[#0D1117] border-l border-theme-accent/30 hidden lg:flex flex-col shrink-0 transition-colors duration-500">
        
        {/* Kullanıcı Profili ve Trust Score Banner */}
        <div className="p-8 border-b border-gray-800 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/5 rounded-full blur-3xl -mr-10 -mt-10 transition-colors duration-500"></div>
          
          <div className="w-24 h-24 rounded-full border-4 border-theme-accent flex items-center justify-center bg-[#0D1117] neon-glow-theme mb-4 relative z-10 transition-colors duration-500">
            <span className="text-theme-accent font-bold text-4xl transition-colors duration-500">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          
          <h3 className="text-xl font-bold text-white tracking-wider z-10">{user.name}</h3>
          <div className="text-xs text-theme-accent uppercase tracking-widest font-semibold mt-1 mb-6 z-10 transition-colors duration-500">{user.role}</div>

          <div className="bg-card-bg border border-theme-accent/50 px-6 py-4 rounded-xl flex flex-col items-center justify-center w-full relative z-10 transition-colors duration-500" style={{ boxShadow: '0 0 20px color-mix(in srgb, var(--theme-accent) 20%, transparent)' }}>
            <Zap size={24} className="text-theme-accent mb-2 animate-pulse transition-colors duration-500" />
            <span className="text-xs text-gray-400 uppercase tracking-widest mb-1">Trust Score</span>
            <span className="text-3xl font-black text-theme-accent text-glow-theme transition-colors duration-500">{user.trustScore}</span>
          </div>
        </div>

        {/* Son Etkileşimler */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <h4 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
            <Activity size={16} className="text-theme-accent" />
            Son Etkileşimler
          </h4>
          
          <div className="space-y-4">
            {/* Şimdilik Mock Veri ile Etkileşimler */}
            <div className="bg-card-bg/50 border border-gray-800 p-3 rounded-lg flex items-start gap-3 hover:border-theme-accent/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-theme-accent/10 flex items-center justify-center shrink-0 mt-0.5 text-theme-accent">
                <Zap size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Sorun başarıyla paylaşıldı. Topluluk değerlendirmesi bekleniyor.
                </p>
                <span className="text-[10px] text-gray-500 mt-1 block">Az önce</span>
              </div>
            </div>

            <div className="bg-card-bg/50 border border-gray-800 p-3 rounded-lg flex items-start gap-3 hover:border-theme-accent/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-theme-accent/10 flex items-center justify-center shrink-0 mt-0.5 text-theme-accent">
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
