import React from "react";
import { Link } from "react-router-dom";
import { 
  Play, Clock, HelpCircle, Target, 
  ChevronRight, Calendar, ShieldCheck, Zap 
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const testBatches = [
  {
    category: "Full Length Mock Tests",
    description: "Simulate the 3-hour pattern with 720 marks and full syllabus covering Physics, Chemistry, and Biology.",
    items: [
      { id: "full-1", title: "NEET All India Mock 01", questions: 180, duration: 180, attempts: "12k+", difficulty: "Medium" },
      { id: "full-2", title: "NEET All India Mock 02", questions: 180, duration: 180, attempts: "8k+", difficulty: "Hard" },
      { id: "full-3", title: "Previous Year 2024 Paper", questions: 180, duration: 180, attempts: "45k+", difficulty: "Medium" },
    ]
  },
  {
    category: "Chapter-wise Practice",
    description: "Focus on specific high-weightage topics like Genetics, Equilibrium, or Optics.",
    items: [
      { id: "ch-1", title: "Molecular Basis of Inheritance", questions: 45, duration: 45, attempts: "25k+", difficulty: "Hard" },
      { id: "ch-2", title: "Chemical Bonding & Structure", questions: 45, duration: 45, attempts: "15k+", difficulty: "Medium" },
      { id: "ch-3", title: "Rotational Motion Master", questions: 45, duration: 45, attempts: "10k+", difficulty: "Hard" },
    ]
  }
];

export default function MockTests() {
  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-cyan-500/20 italic">
            <Target className="w-4 h-4" />
            Strategic Preparation
          </div>
          <h1 className="text-5xl font-black text-white leading-tight italic uppercase tracking-tighter">Mock Test <br/><span className="text-cyan-400">Inventory</span></h1>
          <p className="text-slate-400 text-lg leading-relaxed">Our tests are engineered based on the latest NTA patterns with integrated negative marking and time analytics.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-right bg-[#0D121F] border border-slate-800 p-6 rounded-3xl shadow-xl">
            <p className="text-slate-500 text-[10px] font-black uppercase mb-1 italic tracking-widest">Rank Prediction</p>
            <p className="text-white font-black text-lg italic uppercase">Active</p>
          </div>
          <div className="text-right bg-[#0D121F] border border-slate-800 p-6 rounded-3xl shadow-xl">
            <p className="text-slate-500 text-[10px] font-black uppercase mb-1 italic tracking-widest">Completed</p>
            <p className="text-white font-black text-lg italic tabular-nums">12 / 120</p>
          </div>
        </div>
      </div>

      {/* Batches */}
      <div className="space-y-16">
        {testBatches.map((batch, idx) => (
          <section key={idx} className="space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white italic uppercase tracking-widest">{batch.category}</h2>
                <p className="text-slate-500 text-sm font-medium">{batch.description}</p>
              </div>
              <button className="flex items-center gap-2 text-cyan-400 font-black hover:underline text-[10px] uppercase tracking-widest italic transition-all">
                Explore All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {batch.items.map((test) => (
                <TestCard key={test.id} {...test} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Daily Challenges */}
      <section className="bg-[#0D121F] p-12 rounded-[3.5rem] border border-slate-800 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-cyan-500/10 transition-all duration-700" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-xl shadow-cyan-500/20">
              <Zap className="w-8 h-8 text-white fill-current" />
            </div>
            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Daily Rapid Fire Quiz</h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              Maintain your streak! 10 random MCQs from yesterday's weak topics. Takes less than 5 minutes to complete.
            </p>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="font-black text-xs uppercase tracking-widest italic">+50 XP</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span className="font-black text-xs uppercase tracking-widest italic">Daily Medal</span>
              </div>
            </div>
          </div>
          <Link to={`/test/rapid-${Date.now()}`} className="bg-white text-slate-950 px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/5 flex items-center gap-4 italic uppercase tracking-tighter">
            Start Challenge <Play className="w-6 h-6 fill-current" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function TestCard({ id, title, questions, duration, attempts, difficulty }: any) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-[#0D121F] p-10 rounded-[3rem] border border-slate-800 group hover:border-cyan-500/30 transition-all shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-cyan-500 transition-all shadow-xl group-hover:border-cyan-400">
            <Clock className="w-6 h-6 text-slate-500 group-hover:text-white" />
          </div>
          <div className={cn(
            "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic border",
            difficulty === "Hard" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          )}>
            {difficulty}
          </div>
        </div>

        <h3 className="text-2xl font-black text-white mb-6 group-hover:text-cyan-400 transition-all italic leading-tight uppercase tracking-tight">{title}</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest italic mb-1">Questions</p>
            <p className="text-lg font-black text-white italic tracking-tight">{questions}</p>
          </div>
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-right">
            <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest italic mb-1">Students</p>
            <p className="text-lg font-black text-white italic tracking-tight">{attempts}</p>
          </div>
        </div>

        <Link 
          to={`/test/${id}`}
          className="w-full bg-slate-800/50 border border-slate-700/50 text-white py-4 rounded-xl font-black italic uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-cyan-500 hover:border-cyan-400 transition-all"
        >
          Launch Test <Play className="w-4 h-4 fill-current" />
        </Link>
      </div>
    </motion.div>
  );
}
