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

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(ellipse at bottom, #0D1117 0%, #05070a 100%)' }}>
      <div className="relative w-full max-w-md">
        
        {/* Glow Background effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-xl blur opacity-30"></div>
        
        {/* Main Card */}
        <div className="relative bg-card-bg p-8 rounded-xl border border-accent-purple/30 shadow-2xl">
          
          <h1 className="text-3xl font-bold text-center mb-8 tracking-widest text-glow-cyan text-neon-cyan uppercase">
            Gameveloper
          </h1>

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
              className={`w-full py-3 rounded-md font-bold tracking-widest text-[#0D1117] uppercase transition-all duration-300 ${isLogin ? 'bg-neon-cyan neon-glow-cyan neon-glow-cyan-hover' : 'bg-neon-pink neon-glow-pink hover:shadow-[0_0_20px_#FF00FF,inset_0_0_10px_#FF00FF]'}`}
            >
              {isLogin ? 'Bağlan' : 'Sisteme Katıl'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
