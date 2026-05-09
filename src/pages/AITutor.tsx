import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, BrainCircuit, Sparkles, MessageSquarePlus, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { solveDoubt } from "../services/gemini";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export default function AITutor() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I am your AI NEET Tutor. Whether it's a complex Physics problem or a conceptual doubt in Biology, I'm here to help. What are we studying today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await solveDoubt(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response || "I'm having trouble processing clinical data right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#080B12] p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">AI Clinical <span className="text-cyan-400">Tutor</span></h1>
            <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase italic">Neural Engine Beta v1.4</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-3 bg-slate-900 text-slate-500 hover:text-red-400 rounded-xl transition-all border border-slate-800"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-700 transition-all text-sm border border-slate-700/50">
            <MessageSquarePlus className="w-4 h-4" />
            Archive Session
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#0D121F] rounded-[2.5rem] border border-slate-800 flex flex-col overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-10 relative scroll-smooth"
        >
          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4",
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border",
                  m.role === "bot" ? "bg-slate-900 border-cyan-500/30 text-cyan-400" : "bg-slate-800 border-slate-700 text-slate-100"
                )}>
                  {m.role === "bot" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "max-w-[75%] p-8 rounded-3xl text-slate-200 shadow-xl",
                  m.role === "bot" 
                    ? "bg-slate-900/50 border border-slate-800 rounded-tl-none" 
                    : "bg-cyan-600 text-white rounded-tr-none font-medium"
                )}>
                  <div className="markdown-body prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  <div className={cn(
                    "mt-4 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest",
                    m.role === "bot" ? "text-slate-600" : "text-cyan-200"
                  )}>
                    <Clock className="w-3 h-3" />
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-8 bg-[#080B12]/80 backdrop-blur-xl border-t border-slate-800">
          <div className="relative flex gap-4">
            <div className="flex-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-2xl blur opacity-10 group-focus-within:opacity-30 transition duration-500" />
              <input 
                type="text"
                placeholder="Ask clinical doubts or NCERT concepts..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full relative bg-[#0D121F] border border-slate-800 rounded-2xl py-5 pl-8 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-bold italic tracking-wide"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button className="text-slate-600 hover:text-cyan-400 p-1">
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-white px-8 rounded-2xl transition-all shadow-xl shadow-cyan-900/40 shrink-0 flex items-center justify-center"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4 flex gap-6 text-[8px] font-black text-slate-600 uppercase tracking-widest px-4 italic">
            <span>Clinical Precision: +98.4%</span>
            <span>Grounding: NCERT 2024</span>
            <span className="text-emerald-500">System Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
