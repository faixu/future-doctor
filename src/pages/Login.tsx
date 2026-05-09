import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Zap, Shield, Target } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-dark p-8 md:p-12 rounded-[2.5rem] relative z-10 border border-white/5"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-500/20">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-3">NEET Cracker AI</h1>
          <p className="text-slate-400 text-lg">Your medical journey starts here. AI-enhanced preparation.</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-4 bg-white text-slate-900 font-bold py-4 px-6 rounded-2xl hover:bg-slate-100 transition-all duration-200 shadow-lg"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-[1px] bg-white/5" />
            <span className="text-slate-500 text-sm font-medium uppercase tracking-widest">Why Join?</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Feature icon={Zap} label="AI Doubt Solving" />
            <Feature icon={GraduationCap} label="Rank Prediction" />
            <Feature icon={Shield} label="Verified PYQs" />
            <Feature icon={Target} label="Mock Test Engine" />
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-slate-500 text-sm">
        By signing in, you agree to our Terms of Service.
      </p>
    </div>
  );
}

function Feature({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
      <Icon className="w-4 h-4 text-blue-400" />
      <span className="text-xs font-semibold text-slate-300">{label}</span>
    </div>
  );
}
