import React, { useState } from "react";
import { Search, Filter, BookOpen, Download, ChevronRight, FileText, FileDown, BookMarked } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
const SUBJECTS = ["All", "Physics", "Chemistry", "Biology"];

const pyqData = [
  { id: "p1", title: "NEET 2024 Phase 1", year: 2024, subject: "Full Paper", questions: 180, level: "Moderate" },
  { id: "p2", title: "NEET 2023 Solved Paper", year: 2023, subject: "Full Paper", questions: 180, level: "Hard" },
  { id: "p3", title: "Biology Chapter-wise 2022", year: 2022, subject: "Biology", questions: 90, level: "Moderate" },
  { id: "p4", title: "Organic Chemistry PYQs", year: 2021, subject: "Chemistry", questions: 45, level: "Very Hard" },
  { id: "p5", title: "Mechanics Special 2020", year: 2020, subject: "Physics", questions: 45, level: "Hard" },
  { id: "p6", title: "NEET 2019 Re-exam Paper", year: 2019, subject: "Full Paper", questions: 180, level: "Moderate" },
];

export default function PYQs() {
  const [selectedSubject, setSelectedSubject] = useState("All");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-cyan-500/20 italic">
            <FileText className="w-4 h-4" />
            Archive Library
          </div>
          <h1 className="text-5xl font-black text-white leading-tight uppercase italic tracking-tighter">Previous Year <br/><span className="text-cyan-400">Questions</span></h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">Practice with authentic questions from the last 15 years. Every paper includes verified detailed solutions and NCERT references.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 z-10" />
          <input 
            type="text" 
            placeholder="Search papers, years, topics..."
            className="relative bg-[#0D121F] border border-slate-800 rounded-2xl py-5 pl-12 pr-6 text-white w-full lg:w-96 outline-none focus:border-cyan-500 transition-all font-bold italic tracking-wide"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mr-4 italic">
          <Filter className="w-4 h-4" /> Filter by:
        </div>
        {SUBJECTS.map(s => (
          <button 
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={cn(
              "px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all italic",
              selectedSubject === s ? "bg-cyan-500 text-white shadow-lg shadow-cyan-900/20" : "bg-slate-800/50 text-slate-400 border border-slate-800 hover:text-white"
            )}
          >
            {s}
          </button>
        ))}
        <div className="w-[1px] h-8 bg-slate-800 mx-2" />
        <select className="bg-[#0D121F] border border-slate-800 text-slate-400 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-cyan-500 italic">
          <option>All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pyqData.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#0D121F] p-10 rounded-[3rem] border border-slate-800 group hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-cyan-500 transition-all shadow-xl group-hover:border-cyan-400">
                  <FileDown className="w-6 h-6 text-slate-500 group-hover:text-white" />
                </div>
                <div className="px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                  {item.year}
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-2 group-hover:text-cyan-400 transition-all italic leading-tight uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-10 italic">{item.subject} • {item.questions} Qs</p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                <span>Clinical Difficulty</span>
                <span className={cn(
                  item.level === "Hard" || item.level === "Very Hard" ? "text-orange-500" : "text-emerald-400"
                )}>{item.level}</span>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-slate-800/50 border border-slate-700/50 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all italic">
                  Solve Now
                </button>
                <button className="w-14 h-14 bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center rounded-xl hover:text-white hover:bg-slate-800 transition-all group-hover:border-slate-700">
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="p-12 rounded-[3.5rem] bg-gradient-to-r from-indigo-900/40 to-[#0D121F] border border-indigo-500/20 flex flex-col md:flex-row items-center gap-10 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05),transparent_70%)] pointer-events-none" />
        <div className="w-20 h-20 bg-cyan-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-cyan-500/20 shrink-0 relative">
          <BookMarked className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-3 relative">
          <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">Topper's Revision Hack</h4>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">Research shows that repeating PYQs from the last 5 years at least 3 times can boost your score by 15-20%.</p>
        </div>
        <button className="relative bg-white text-slate-950 px-10 py-5 rounded-2xl font-black italic uppercase tracking-widest ml-auto hover:scale-105 transition-all shadow-2xl shadow-white/10 active:scale-95">
          Unlock 500+ Papers
        </button>
      </div>
    </div>
  );
}
