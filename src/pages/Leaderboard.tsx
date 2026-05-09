import React from "react";
import { Trophy, Medal, Crown, TrendingUp, Users, Target } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const topThree = [
  { rank: 2, name: "Sneha Kapoor", score: 712, avatar: "SK", level: 24, trend: "up" },
  { rank: 1, name: "Rahul Sharma", score: 715, avatar: "RS", level: 28, trend: "stable" },
  { rank: 3, name: "Amit Patel", score: 708, avatar: "AP", level: 22, trend: "down" },
];

const leaderData = [
  { rank: 4, name: "Priya Singh", score: 702, level: 21 },
  { rank: 5, name: "Vikram Raj", score: 698, level: 19 },
  { rank: 6, name: "Ananya D.", score: 695, level: 20 },
  { rank: 7, name: "Ishaan M.", score: 690, level: 18 },
  { rank: 8, name: "Kunal J.", score: 688, level: 17 },
  { rank: 9, name: "Riya S.", score: 685, level: 19 },
  { rank: 10, name: "Siddhant V.", score: 682, level: 16 },
];

export default function Leaderboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-yellow-500/20 italic mx-auto">
          <Trophy className="w-4 h-4" />
          Neural Ranking System
        </div>
        <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter">Hall of <span className="text-cyan-400">Legends</span></h1>
        <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto italic">Top 0.01% of NEET aspirants globally. Rankings updated every 60 seconds based on mock test velocity and accuracy.</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-4xl mx-auto py-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.05),transparent_70%)] pointer-events-none" />
        
        {/* Silver */}
        <PodiumCard user={topThree[0]} delay={0.1} rank={2} color="slate-400" />
        {/* Gold */}
        <PodiumCard user={topThree[1]} delay={0} rank={1} isGold />
        {/* Bronze */}
        <PodiumCard user={topThree[2]} delay={0.2} rank={3} color="orange-600" />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0D121F] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-lg font-black text-white italic uppercase tracking-widest">Global Ranking</h2>
          <div className="flex gap-4">
            <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 italic">Daily</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Weekly</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">All-Time</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 text-[10px] font-black uppercase tracking-widest italic border-b border-slate-800/50">
                <th className="py-6 px-10">Rank</th>
                <th className="py-6 px-4">Student</th>
                <th className="py-6 px-4">Daily Velocity</th>
                <th className="py-6 px-4 text-right">NCERT Mastery</th>
                <th className="py-6 px-10 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {leaderData.map((user) => (
                <tr key={user.rank} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 px-10">
                    <span className="text-slate-400 font-bold italic tracking-tighter tabular-nums">#{user.rank}</span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-black text-slate-400 italic group-hover:border-cyan-500/30 transition-all">
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-black italic uppercase tracking-tight group-hover:text-cyan-400 transition-all">{user.name}</p>
                        <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest italic">Rank Pool: {user.level}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${60 + Math.random() * 30}%` }}
                        />
                      </div>
                      <span className="text-slate-600 text-[8px] font-black italic">CLINICAL</span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <span className="text-emerald-400 font-bold italic tabular-nums">98.4%</span>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-white font-black italic tabular-nums">{user.score}</span>
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-slate-800 text-center">
          <button className="text-slate-500 font-black italic uppercase tracking-widest text-[10px] hover:text-white transition-all">Load More Legends</button>
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ user, delay, rank, isGold, color }: any) {
  const accentColor = isGold ? 'yellow-400' : color;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "bg-[#0D121F] border p-10 rounded-[3rem] text-center space-y-6 shadow-2xl relative",
        isGold ? "border-cyan-500/30 scale-110 z-10 p-12 rounded-[3.5rem] shadow-[0_0_50px_rgba(34,211,238,0.1)]" : "border-slate-800"
      )}
    >
      <div className={cn(
        "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-black italic border-4 border-[#080B12]",
        isGold ? "w-16 h-16 bg-yellow-400 text-slate-950 shadow-2xl shadow-yellow-400/20" : `w-12 h-12 bg-${color} text-slate-950`
      )}>
        {rank}
      </div>
      
      <div className={cn(
        "rounded-full mx-auto p-1 border-2",
        isGold ? "w-32 h-32 bg-gradient-to-tr from-yellow-400/20 to-yellow-400/40 border-yellow-400/30" : `w-24 h-24 bg-gradient-to-tr from-${color}/20 to-${color}/40 border-${color}/20`
      )}>
        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
          <span className={cn("font-black", isGold ? "text-3xl text-yellow-400" : `text-2xl text-${color}`)}>
            {user.avatar}
          </span>
          {isGold && <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 to-transparent" />}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className={cn("font-black text-white italic uppercase tracking-tight", isGold ? "text-3xl tracking-tighter" : "text-2xl tracking-tight")}>
          {user.name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          {isGold && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Level {user.level}</p>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <p className={cn("font-black text-cyan-400 italic", isGold ? "text-3xl" : "text-xl")}>
          {user.score} <span className="text-[10px] text-slate-600">PTS</span>
        </p>
      </div>
    </motion.div>
  );
}
