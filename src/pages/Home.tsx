import React, { useState, useEffect } from "react";
import { Zap, BookOpen, Clock, Users, ArrowRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const target = new Date("2026-05-03T00:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 to-[#0D121F] border border-slate-800 p-12 overflow-hidden min-h-[500px] flex items-center">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-cyan-500/20"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            AI Recommended Entry
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black text-white leading-tight uppercase tracking-tighter italic"
          >
            Welcome <br/><span className="text-cyan-400">Future Doctor</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-cyan-500/80 uppercase tracking-[0.3em] mt-4 mb-2 italic"
          >
            Turning Aspirants into Doctors
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg leading-relaxed max-w-lg"
          >
            Master 50,000+ MCQs, practice real-time mock tests, and resolve clinical doubts instantly with our medical-trained AI engine.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 pt-4"
          >
            <Link to="/tests" className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-900/20">
              Start Test Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/study" className="bg-slate-800/50 text-slate-300 border border-slate-700/50 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
              View Resources
            </Link>
          </motion.div>
        </div>

        {/* Countdown Floating Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-12 right-12 bg-[#131926] border border-slate-800 p-8 rounded-3xl text-center hidden xl:block shadow-2xl"
        >
          <Clock className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">NEET 2026 Lockdown</p>
          <h3 className="text-3xl font-black text-white tabular-nums italic tracking-tighter">{timeLeft || "UNLOADED"}</h3>
        </motion.div>
      </section>

      {/* Motivational Bar */}
      <div className="flex items-center gap-6 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl italic text-slate-400 text-lg">
        <span className="text-cyan-400 font-bold not-italic text-sm uppercase tracking-widest">Quote:</span>
        "Total mastery in <span className="text-white font-bold">Organic Chemistry</span> requires daily repetition. The AI has spotted your lag in Block Elements."
      </div>

      {/* Subject Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Subject Mastery Tracks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SubjectCard 
            title="Biology" 
            count="18.5k Qs" 
            color="emerald" 
            icon="🧬"
            progress={65}
          />
          <SubjectCard 
            title="Physics" 
            count="12.2k Qs" 
            color="blue" 
            icon="⚡"
            progress={42}
          />
          <SubjectCard 
            title="Chemistry" 
            count="15.4k Qs" 
            color="orange" 
            icon="🧪"
            progress={58}
          />
        </div>
      </section>
    </div>
  );
}

function SubjectCard({ title, count, color, icon, progress }: any) {
  const colors: any = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400"
  };
  const barColors: any = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500"
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-8">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border", colors[color])}>
          {icon}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{count}</p>
      </div>
      
      <h3 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tight">{title}</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Accuracy</span>
          <span className="text-white">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-1000", barColors[color])} style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      <button className="mt-8 w-full bg-slate-800/50 border border-slate-700/50 text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-cyan-500 transition-all duration-300">
        Review Path <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
