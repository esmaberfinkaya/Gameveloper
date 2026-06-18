"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("GAMER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { email, password } : { email, password, name, role };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sunucu hatası.");

      if (isLogin) {
        setSuccess(`Hoş geldin, ${data.user.name}! Başarıyla giriş yaptın.`);
        console.log("Token:", data.token);
        
        // Kullanıcı verilerini ve token'ı sakla
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Başarılı giriş sonrası yönlendirme
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setSuccess("Kayıt başarılı! Lütfen giriş yapınız.");
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFastLogin = async (role: "DEVELOPER" | "GAMER") => {
    setError("");
    setSuccess("");
    // Esma: esma@gameveloper.com, AlphaGamer: alphagamer@gameveloper.com
    const testEmail = role === "DEVELOPER" ? "esma@gameveloper.com" : "alphagamer@gameveloper.com";
    const testPassword = "123456";

    try {
      const res = await fetch(`http://localhost:5000/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail, password: testPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sunucu hatası.");

      setSuccess(`Hoş geldin, ${data.user.name}! Hızlı giriş başarılı.`);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      setError(err.message + " Lütfen backend'de seed işleminin ('npx prisma db seed') yapıldığından emin olun.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(ellipse at bottom, #0D1117 0%, #05070a 100%)' }}>
      
      {/* Glitch Overlay Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10 flex flex-col justify-between">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`h-[1px] w-full ${i % 2 === 0 ? 'bg-neon-cyan' : 'bg-neon-pink'} animate-pulse`} style={{ animationDelay: `${i * 0.1}s` }}></div>
        ))}
      </div>
      <div className="relative w-full max-w-md">
        
        {/* Glow Background effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-xl blur opacity-30"></div>
        
        <div className="relative bg-card-bg/90 backdrop-blur-xl p-8 rounded-xl border border-accent-purple/30 shadow-[0_0_40px_rgba(0,255,255,0.1),0_0_40px_rgba(255,0,255,0.1)]">
          
          <div className="relative mb-8 text-center">
            <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink uppercase relative inline-block">
              <span className="absolute -left-[2px] -top-[2px] text-neon-cyan opacity-50 mix-blend-screen animate-pulse">Gameveloper</span>
              <span className="absolute left-[2px] top-[2px] text-neon-pink opacity-50 mix-blend-screen animate-pulse" style={{ animationDelay: '0.1s' }}>Gameveloper</span>
              Gameveloper
            </h1>
            <p className="text-gray-500 text-xs tracking-[0.3em] mt-2 uppercase">Sistem Erişimi</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-accent-purple/50">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 font-medium tracking-wider transition-all duration-300 ${isLogin ? 'text-neon-cyan border-b-2 border-neon-cyan text-glow-cyan' : 'text-gray-400 hover:text-gray-200'}`}
            >
              GİRİŞ YAP
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 font-medium tracking-wider transition-all duration-300 ${!isLogin ? 'text-neon-pink border-b-2 border-neon-pink text-glow-pink' : 'text-gray-400 hover:text-gray-200'}`}
            >
              KAYIT OL
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-accent-purple mb-1">Kullanıcı Adı</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md input-cyber" 
                  placeholder="NeonHero_99"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-accent-purple mb-1">E-posta</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md input-cyber" 
                placeholder="dev@gameveloper.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-accent-purple mb-1">Şifre</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md input-cyber" 
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-accent-purple mb-2">Rol Seçimi</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="GAMER" checked={role === "GAMER"} onChange={(e) => setRole(e.target.value)} className="accent-neon-cyan" />
                    <span className="text-gray-200">Gamer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" value="DEVELOPER" checked={role === "DEVELOPER"} onChange={(e) => setRole(e.target.value)} className="accent-neon-pink" />
                    <span className="text-gray-200">Developer</span>
                  </label>
                </div>
              </div>
            )}

            {error && <p className="text-red-400 text-sm p-3 bg-red-900/30 border border-red-500 rounded-md shadow-[0_0_10px_rgba(255,0,0,0.2)]">{error}</p>}
            {success && <p className="text-green-400 text-sm p-3 bg-green-900/30 border border-green-500 rounded-md shadow-[0_0_10px_rgba(0,255,0,0.2)]">{success}</p>}

            <button 
              type="submit" 
              className={`w-full py-3 rounded-md font-bold tracking-widest text-[#0D1117] uppercase transition-all duration-300 ${isLogin ? 'bg-neon-cyan neon-glow-cyan hover:shadow-[0_0_20px_#00FFFF,inset_0_0_10px_#00FFFF]' : 'bg-neon-pink neon-glow-pink hover:shadow-[0_0_20px_#FF00FF,inset_0_0_10px_#FF00FF]'}`}
            >
              {isLogin ? 'Sisteme Bağlan' : 'Ağa Katıl'}
            </button>
          </form>

          {/* Hızlı Giriş (Test) */}
          <div className="mt-8 pt-6 border-t border-gray-800/80">
            <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-4">Hızlı Test Girişi</p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleFastLogin("DEVELOPER")}
                className="flex-1 py-2 px-2 border border-neon-cyan/50 rounded bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-all text-xs font-bold flex flex-col items-center gap-1"
              >
                <span>Esma</span>
                <span className="text-[9px] opacity-70">(DEVELOPER)</span>
              </button>
              <button 
                onClick={() => handleFastLogin("GAMER")}
                className="flex-1 py-2 px-2 border border-neon-pink/50 rounded bg-neon-pink/10 text-neon-pink hover:bg-neon-pink/20 transition-all text-xs font-bold flex flex-col items-center gap-1"
              >
                <span>AlphaGamer</span>
                <span className="text-[9px] opacity-70">(GAMER)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
