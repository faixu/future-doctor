import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Trophy, TrendingUp, Clock, AlertCircle, 
  CheckCircle2, XCircle, BarChart3, RotateCcw, Share2
} from "lucide-react";
import { motion } from "motion/react";
import ReactConfetti from "react-confetti";
import { formatTime, cn } from "../lib/utils";

export default function Results() {
  const { testId } = useParams();
  const [result, setResult] = useState<any>(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const data = localStorage.getItem(`last_result_${testId}`);
    if (data) setResult(JSON.parse(data));

    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [testId]);

  if (!result) return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">Loading Results...</div>;

  const scorePercentage = (result.score / 720) * 100;
  const isSelected = result.score > 600;

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center">
      {isSelected && <ReactConfetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

      <div className="max-w-5xl w-full space-y-12 pb-20">
        {/* Header Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/20"
          >
            <Trophy className="w-12 h-12" />
          </motion.div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white">Test Completed!</h1>
            <p className="text-slate-400 font-medium text-lg">Detailed analysis for <span className="text-blue-400 font-bold uppercase tracking-widest">{testId}</span></p>
          </div>
        </div>

        {/* Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="text-center lg:text-left space-y-2">
              <p className="text-slate-500 text-sm font-black uppercase tracking-widest">Your Score</p>
              <div className="flex items-baseline justify-center lg:justify-start gap-2">
                <span className="text-8xl font-black text-white tracking-tighter">{result.score}</span>
                <span className="text-3xl font-bold text-slate-500">/ 720</span>
              </div>
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold",
                isSelected ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                <TrendingUp className="w-4 h-4" />
                {isSelected ? "TOP 2% PERFORMANCE" : "IMPROVEMENT NEEDED"}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                    strokeDasharray={552.92}
                    strokeDashoffset={552.92 - (552.92 * scorePercentage) / 100}
                    className="text-blue-600 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-white">{Math.round(scorePercentage)}%</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg mb-4">Rank Prediction</h4>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">Target Rank (Estimated)</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-white">#1,450</span>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                    <TrendingUp className="w-4 h-4" />
                    +240 positions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <DetailStat icon={CheckCircle2} color="text-emerald-500" label="Correct" value={result.correct} />
          <DetailStat icon={XCircle} color="text-red-500" label="Incorrect" value={result.incorrect} />
          <DetailStat icon={AlertCircle} color="text-slate-500" label="Unattempted" value={result.unattempted} />
          <DetailStat icon={Clock} color="text-blue-500" label="Avg Time / Q" value={`${Math.round(result.timeTaken / result.totalQuestions)}s`} />
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-12">
          <Link to={`/test/${testId}`} className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
            <RotateCcw className="w-5 h-5" /> Retake Test
          </Link>
          <button className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
            <BarChart3 className="w-5 h-5" /> Detailed Analytics
          </button>
          <button className="w-16 bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center rounded-2xl hover:text-white transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ icon: Icon, color, label, value }: any) {
  return (
    <div className="glass-dark p-8 rounded-3xl border-white/5 flex flex-col items-center text-center">
      <div className={cn("p-4 rounded-2xl bg-white/5 mb-4", color)}>
        <Icon className="w-8 h-8" />
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h5 className="text-3xl font-black text-white">{value}</h5>
    </div>
  );
}
