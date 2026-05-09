import React from "react";
import { 
  FileText, Download, Eye, Sparkles, 
  Search, Bookmark, Zap, BookMarked 
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const resourceBatches = [
  {
    category: "High Yield Notes",
    items: [
      { id: "h1", title: "Human Physiology Master Map", subject: "Biology", type: "Mind Map", pages: 12, rating: 4.9 },
      { id: "h2", title: "General Organic Chemistry", subject: "Chemistry", type: "Short Notes", pages: 24, rating: 4.8 },
      { id: "h3", title: "Ray Optics Formulas", subject: "Physics", type: "Cheat Sheet", pages: 5, rating: 5.0 },
    ]
  },
  {
    category: "NCERT Summaries",
    items: [
      { id: "n1", title: "Class 11 Biology Recap", subject: "Biology", type: "Summary", pages: 45, rating: 4.7 },
      { id: "n2", title: "Inorganic Trends Table", subject: "Chemistry", type: "Table", pages: 8, rating: 4.9 },
      { id: "n3", title: "Mechanics Summary", subject: "Physics", type: "Summary", pages: 32, rating: 4.6 },
    ]
  }
];

export default function StudyMaterial() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-orange-500/20 italic">
            <Zap className="w-4 h-4" />
            Premium Resources
          </div>
          <h1 className="text-5xl font-black text-white leading-tight italic uppercase tracking-tighter">Study <br/><span className="text-cyan-400">Vault</span></h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">Curated notes, flashcards, and NCERT-based summaries designed for rapid revision before the big day.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#0D121F] border border-slate-800 rounded-2xl p-6 flex items-center gap-6 shadow-2xl">
            <div className="p-3 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-black italic uppercase tracking-widest text-sm">Smart Search</p>
              <p className="text-slate-500 text-[8px] font-black uppercase mt-1 italic tracking-widest">Neural Indexing Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-20">
        {resourceBatches.map((batch, idx) => (
          <section key={idx} className="space-y-10">
            <h2 className="text-xs font-black text-slate-500 flex items-center gap-4 italic uppercase tracking-widest">
              <span className="w-12 h-[1px] bg-slate-800"></span>
              {batch.category}
              <span className="flex-1 h-[1px] bg-slate-800"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {batch.items.map((item) => (
                <ResourceCard key={item.id} {...item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Extra Action */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-[#0D121F] p-16 rounded-[4rem] border border-indigo-500/20 text-center space-y-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.05),transparent_70%)]" />
        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter relative z-10">Need a Personalized Study Plan?</h3>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed relative z-10">Tell our AI Tutor your weak areas, and we'll generate a custom revision schedule just for you based on NTA High-Weightage patterns.</p>
        <Link to="/ai-tutor" className="relative z-10 inline-flex items-center gap-4 bg-cyan-500 text-white px-12 py-5 rounded-2xl font-black italic uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-900/40 hover:scale-105 active:scale-95">
          Generate Plan <BookMarked className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

function ResourceCard({ title, subject, type, pages, rating }: any) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-[#0D121F] p-10 rounded-[3rem] border border-slate-800 group relative shadow-2xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-all shadow-xl">
            <FileText className="w-6 h-6 text-slate-500 group-hover:text-white" />
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-orange-500 italic uppercase bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20">
            <Sparkles className="w-3 h-3 fill-current" /> {rating}
          </div>
        </div>

        <div className="space-y-3 mb-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 italic leading-none">{subject} • {type}</p>
          <h4 className="text-2xl font-black text-white leading-tight italic uppercase tracking-tight group-hover:text-cyan-400 transition-all">{title}</h4>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-slate-800">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">{pages} Pages</span>
          <div className="flex gap-3">
            <button className="p-3 bg-slate-900 border border-slate-800 text-slate-500 hover:text-white rounded-xl hover:bg-slate-800 transition-all">
              <Eye className="w-5 h-5" />
            </button>
            <button className="p-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-900/20">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { Link } from "react-router-dom";
