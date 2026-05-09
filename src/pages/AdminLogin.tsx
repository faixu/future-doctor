import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { checkServerAdmin } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Sync global state
        await checkServerAdmin();
        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("A connection error occurred. Please check the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A13] flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0D121F]/80 backdrop-blur-xl border border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-cyan-900/40">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Admin <span className="text-cyan-400">Portal</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center italic">Authorized Personnel Only • Secure Access Module</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3" /> System Email
            </label>
            <div className="relative group">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-[#070A13] border border-slate-800 rounded-xl py-4 px-6 text-white font-black italic tracking-widest outline-none focus:border-cyan-500 transition-all peer"
              />
              <div className="absolute inset-0 rounded-xl border border-cyan-500/0 peer-focus:border-cyan-500/20 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> Access Code
            </label>
            <div className="relative group">
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070A13] border border-slate-800 rounded-xl py-4 px-6 text-white font-black italic tracking-widest outline-none focus:border-cyan-500 transition-all peer"
              />
              <div className="absolute inset-0 rounded-xl border border-cyan-500/0 peer-focus:border-cyan-500/20 pointer-events-none" />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/10"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed italic">{error}</p>
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            {loading ? "Decrypting..." : "Authenticate Access"}
            {!loading && <ChevronRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">
            By accessing this dashboard, you agree to our <br/>
            <span className="text-slate-500">Master Service Level Agreement</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
