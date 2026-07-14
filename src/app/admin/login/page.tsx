"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { loginAdmin } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginAdmin(password);
    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-950 text-white z-50 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-gray-950 to-pink-900/40 opacity-70"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent blur-3xl rounded-full mix-blend-screen animate-pulse duration-[8000ms]"></div>
      </div>

      <form onSubmit={handleLogin} className="glass p-10 rounded-3xl w-full max-w-sm flex flex-col items-center relative z-10 border border-white/10 shadow-[0_20px_50px_rgba(255,113,154,0.1)]">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-full mb-6 shadow-[0_0_20px_rgba(255,113,154,0.4)] border border-white/20">
          <Lock size={32} className="text-white" />
        </div>
        
        <h2 className="text-3xl font-outfit mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-bold">Admin Portal</h2>
        <p className="text-gray-400 font-inter text-sm mb-8 text-center">Secure access required to modify the BirthdayVerse celebration.</p>
        
        <div className="w-full relative mb-4">
          <input
            type="password"
            placeholder="Enter secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-inter placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all shadow-inner"
          />
        </div>
        
        {error && <p className="text-pink-400 text-sm mb-4 font-inter text-center animate-pulse">{error}</p>}
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl py-4 font-semibold text-lg hover:shadow-[0_0_25px_rgba(255,113,154,0.5)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {isLoading ? "Authenticating..." : "Unlock Dashboard"}
        </button>
        
        <p className="mt-8 text-xs text-gray-500 font-inter tracking-wide uppercase">Default pass: birthday2026</p>
      </form>
    </div>
  );
}
