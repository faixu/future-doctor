import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Bookmark, 
  Flag, CheckCircle2, Clock, Info, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatTime, cn } from "../lib/utils";

// Mock Question data for the engine
const generateMockQuestions = (count: number, subject: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${subject}-${i+1}`,
    subject,
    text: `Identify the correct statement regarding ${subject} topic ${i+1}. This is a multi-line NEET level concept question designed to test your core medical understanding.`,
    options: [
      "A) Statement one is biologically correct and follows NCERT.",
      "B) Statement two represents a common medical misconception.",
      "C) Statement three is the primary exception to the rule.",
      "D) None of the above are scientifically accurate."
    ],
    correctIndex: Math.floor(Math.random() * 4),
    explanation: "This is a detailed explanation explaining why the chosen option is correct and why others are wrong based on NCERT Page 42.",
    difficulty: i % 3 === 0 ? "Hard" : i % 2 === 0 ? "Medium" : "Easy"
  }));
};

const ALL_QUESTIONS = [
  ...generateMockQuestions(45, "Physics"),
  ...generateMockQuestions(45, "Chemistry"),
  ...generateMockQuestions(90, "Biology (Botany + Zoology)")
];

export default function TestEngine() {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    // Calculate scores
    let correct = 0;
    let incorrect = 0;
    Object.entries(answers).forEach(([idx, ans]) => {
      if (ans === ALL_QUESTIONS[Number(idx)].correctIndex) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const totalMarks = (correct * 4) - (incorrect * 1);
    const result = {
      testId,
      score: totalMarks,
      totalQuestions: ALL_QUESTIONS.length,
      correct,
      incorrect,
      unattempted: ALL_QUESTIONS.length - Object.keys(answers).length,
      timeTaken: 3 * 60 * 60 - timeLeft
    };

    // Store in localStorage for demo, would go to Firestore in production
    localStorage.setItem(`last_result_${testId}`, JSON.stringify(result));
    navigate(`/results/${testId}`);
  };

  const currentQuestion = ALL_QUESTIONS[currentIdx];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-slate-300">NEET FULL MOCK - 01</h1>
            <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest">Physics • Chemistry • Biology</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className={cn(
            "flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-lg font-bold",
            timeLeft < 300 ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-white"
          )}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setShowConfirmSubmit(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-600/20"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto bg-white p-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Subject Indicator */}
            <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-tighter">
              <Info className="w-3 h-3" />
              {currentQuestion.subject} • Q{currentIdx + 1}
            </div>

            {/* Question Text */}
            <div className="space-y-6">
              <h2 className="text-2xl font-medium text-slate-900 leading-snug">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, i) => {
                const isSelected = answers[currentIdx] === i;
                return (
                  <button
                    key={i}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}
                    className={cn(
                      "group flex items-center gap-6 p-6 rounded-2xl border-2 text-left transition-all duration-200",
                      isSelected 
                        ? "border-blue-600 bg-blue-50/50 shadow-sm" 
                        : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={cn(
                      "text-lg font-medium",
                      isSelected ? "text-blue-900" : "text-slate-700"
                    )}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-12 border-t border-slate-100">
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setMarkedForReview(prev => {
                      const next = new Set(prev);
                      if (next.has(currentIdx)) next.delete(currentIdx);
                      else next.add(currentIdx);
                      return next;
                    });
                  }}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                    markedForReview.has(currentIdx) 
                      ? "bg-amber-500 text-white" 
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  <Bookmark className="w-4 h-4" />
                  Mark for Review
                </button>
                <button 
                  onClick={() => setAnswers(prev => {
                    const next = { ...prev };
                    delete next[currentIdx];
                    return next;
                  })}
                  className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className="p-3 text-slate-500 hover:bg-slate-100 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => {
                    if (currentIdx < ALL_QUESTIONS.length - 1) {
                      setCurrentIdx(prev => prev + 1);
                    }
                  }}
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                  Save & Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Palette */}
        <aside className={cn(
          "w-80 bg-slate-50 border-l border-slate-200 h-full overflow-y-auto transition-all",
          !isSidebarOpen && "w-0 overflow-hidden border-0"
        )}>
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 tracking-tight">QUESTION PALETTE</h3>
              <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                180 QUESTIONS
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              <LegendItem color="bg-emerald-500" label="Answered" />
              <LegendItem color="bg-slate-200" label="Not Visited" />
              <LegendItem color="bg-amber-500" label="Marked" />
              <LegendItem color="bg-blue-600" label="Current" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 pt-4">
              {ALL_QUESTIONS.map((_, i) => {
                const isCurrent = currentIdx === i;
                const isAnswered = answers[i] !== undefined;
                const isMarked = markedForReview.has(i);

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIdx(i)}
                    className={cn(
                      "aspect-square rounded-lg text-xs font-black transition-all flex items-center justify-center",
                      isCurrent && "ring-2 ring-blue-600 ring-offset-2",
                      isAnswered && !isMarked && "bg-emerald-500 text-white",
                      isMarked && "bg-amber-500 text-white",
                      !isAnswered && !isMarked && "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowConfirmSubmit(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 text-center mb-2">Finish Test?</h4>
              <p className="text-slate-500 text-center mb-8 font-medium">
                You have {ALL_QUESTIONS.length - Object.keys(answers).length} unanswered questions. Are you sure you want to submit?
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowConfirmSubmit(false)}
                  className="py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  No, Go Back
                </button>
                <button 
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                >
                  Yes, Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-3 h-3 rounded-sm", color)} />
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
    </div>
  );
}
