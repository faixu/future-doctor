import React from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from "recharts";
import { 
  TrendingUp, Activity, Award, Flame, Zap, 
  ChevronRight, Target, BrainCircuit 
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

const performanceData = [
  { name: "Mon", score: 620 },
  { name: "Tue", score: 645 },
  { name: "Wed", score: 610 },
  { name: "Thu", score: 680 },
  { name: "Fri", score: 670 },
  { name: "Sat", score: 710 },
  { name: "Sun", score: 695 },
];

const subjectData = [
  { subject: "Biology", strength: 88, color: "#10b981" },
  { subject: "Physics", strength: 62, color: "#8b5cf6" },
  { subject: "Chemistry", strength: 75, color: "#f59e0b" },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Sleek Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">NEET PREP PERFORMANCE CENTER</span>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Welcome, <span className="text-cyan-400">Dr. {user?.displayName?.split(' ')[0]}</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 bg-[#0D121F] border border-slate-800 px-6 py-3 rounded-2xl shadow-xl">
            <div className="text-center">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Global Rank</p>
              <p className="text-lg font-black text-cyan-400 italic">#412</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Daily XP</p>
              <p className="text-lg font-black text-emerald-400 italic">2,450</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Streak</p>
              <p className="text-lg font-black text-orange-500 italic">🔥 14</p>
            </div>
          </div>
        </div>
      </header>

      {/* Feature High Yield Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Clinical Accuracy" value="84%" trend="+2.4%" color="cyan" icon={TrendingUp} />
        <StatCard title="NCERT Mastery" value="72%" trend="+4.1%" color="emerald" icon={Activity} />
        <StatCard title="Test Velocity" value="48 Q/hr" trend="-1.2%" color="indigo" icon={Award} />
        <StatCard title="AI Doubt Score" value="9.4/10" trend="+0.5" color="orange" icon={Zap} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="xl:col-span-2 bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] h-[500px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-lg font-black text-white italic tracking-widest uppercase">Weekly Trajectory</h3>
              <p className="text-xs text-slate-500 font-bold">Based on latest Mock Test series</p>
            </div>
            <select className="bg-slate-900 border border-slate-800 text-slate-400 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none focus:border-cyan-500">
              <Option value="week">Past Week</Option>
              <Option value="month">Past Month</Option>
            </select>
          </div>
          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="900" />
                <YAxis stroke="#475569" fontSize={10} fontWeight="900" domain={[500, 720]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#080B12", border: "1px solid #1e293b", borderRadius: "16px", padding: "12px" }}
                  itemStyle={{ color: "#22d3ee", fontWeight: "900" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#22d3ee" 
                  strokeWidth={5} 
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, fill: "#fff", stroke: "#22d3ee", strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-900/40 to-[#0D121F] border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-cyan-500/10 rounded-2xl">
                <BrainCircuit className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-black text-white italic tracking-widest uppercase">AI Diagnosis</h3>
            </div>
            <div className="space-y-6">
              <InsightItem 
                title="Critical Lag Identified" 
                desc="Your speed in numerical calculation for Wave Optics is 30% below AIR 500 average." 
              />
              <InsightItem 
                title="Pathways Cleared" 
                desc="GOC concept bridge is solid. You're ready for Reaction Mechanism Mock Phase." 
              />
              <button className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-white py-4 rounded-xl font-black italic tracking-widest uppercase transition-all shadow-xl shadow-cyan-900/20">
                Correct Performance
              </button>
            </div>
          </div>

          <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xs font-black text-slate-500 italic tracking-widest uppercase mb-8">Clinical Mastery Map</h3>
            <div className="space-y-8">
              {subjectData.map((item) => (
                <div key={item.subject} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{item.subject}</span>
                    <span className="text-white font-black text-xl italic">{item.strength}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${item.strength}%`, backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, color, icon: Icon }: any) {
  const colors: any = {
    cyan: "text-cyan-400 bg-cyan-500/5",
    emerald: "text-emerald-400 bg-emerald-500/5",
    indigo: "text-indigo-400 bg-indigo-500/5",
    orange: "text-orange-500 bg-orange-500/5"
  };

  return (
    <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl hover:border-cyan-500/30 transition-all group">
      <div className="flex items-center justify-between mb-8">
        <div className={cn("p-4 rounded-2xl transition-colors", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-emerald-500 text-[10px] font-black bg-emerald-500/10 px-2 py-1 rounded-lg italic">
          {trend}
        </span>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">{title}</p>
      <h4 className="text-3xl font-black text-white italic tracking-tighter">{value}</h4>
    </div>
  );
}

function InsightItem({ title, desc }: any) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
      <h5 className="text-sm font-bold text-white mb-1">{title}</h5>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function Option({ children, value }: any) {
  return <option value={value} className="bg-slate-900 text-white">{children}</option>;
}
