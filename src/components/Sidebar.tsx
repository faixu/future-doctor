import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  MessageSquare, 
  History, 
  Settings, 
  LogOut,
  GraduationCap
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Study Material", href: "/study" },
  { icon: GraduationCap, label: "Mock Tests", href: "/tests" },
  { icon: History, label: "PYQs", href: "/pyq" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: MessageSquare, label: "AI Tutor", href: "/ai-tutor" },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#0D121F] border-r border-slate-800 h-screen sticky top-0 flex flex-col shrink-0 hidden lg:flex">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            N
          </div>
          <div className="flex items-center gap-1">
            <h1 className="text-xl font-bold tracking-tight text-white italic">NEET</h1>
            <span className="text-cyan-400 font-medium italic text-sm">Cracker AI</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold",
                  isActive 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="bg-slate-800/40 p-4 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">AI Analysis Live</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">Focus on <span className="text-cyan-400 font-bold">Physics (Optics)</span>. Your accuracy is lagging by 15% in recent tests.</p>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 transition-all duration-200 w-full text-sm font-bold"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
