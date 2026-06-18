"use client";

import { useEffect, useState } from "react";
import { AlertOctagon } from "lucide-react";

interface AccessGateProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function AccessGate({ allowedRoles, children }: AccessGateProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserRole(parsed.role);
      } catch (e) {
        console.error("User data parse error", e);
      }
    }
  }, []);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  // If user role is not allowed
  if (userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="relative w-full p-6 bg-red-900/10 border border-red-500/50 rounded-xl overflow-hidden flex flex-col items-center justify-center text-center mt-4 shadow-[0_0_20px_rgba(255,0,0,0.15)]">
        {/* Background Glitch / Scanning line */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,0,0,0.2)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan-line pointer-events-none mix-blend-screen"></div>
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none"></div>
        
        <AlertOctagon size={48} className="text-red-500 mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]" />
        
        <h3 className="text-2xl font-black text-red-500 tracking-[0.2em] uppercase relative drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
          <span className="absolute -left-[1px] -top-[1px] text-red-500 opacity-70 mix-blend-screen animate-pulse">ACCESS DENIED</span>
          <span className="absolute left-[1px] top-[1px] text-red-500 opacity-70 mix-blend-screen animate-pulse" style={{ animationDelay: '0.1s' }}>ACCESS DENIED</span>
          ACCESS DENIED
        </h3>
        
        <p className="mt-2 text-sm text-red-400 font-mono uppercase tracking-widest bg-red-900/30 px-4 py-1 rounded border border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.4)]">
          DEVELOPER ROLE REQUIRED
        </p>
      </div>
    );
  }

  // If allowed, render children
  return <>{children}</>;
}
