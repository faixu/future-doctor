import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit,
  Database,
  Users,
  Layout,
  FileText,
  BarChart3,
  Upload,
  BrainCircuit,
  Settings as SettingsIcon,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  ArrowLeft,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

// --- Types ---
interface Question {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  text: string;
  options: string[];
  correctIndex: number;
  solution: string;
  ncertRef: string;
  tags: string[];
  marks: number;
  negativeMarks: number;
  estimatedTime: number;
  imageUrl?: string;
  createdAt: any;
}

interface MockTest {
  id: string;
  title: string;
  type: string;
  duration: number;
  questionIds: string[];
  status: "draft" | "published";
  releaseDate?: any;
  randomizeQuestions?: boolean;
  createdAt: any;
}

interface Paper {
  id: string;
  year: number;
  title: string;
  examType: string;
  pdfUrl?: string;
  questionCount: number;
  createdAt: any;
}

// --- Main Component ---
export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Layout },
    { id: "questions", label: "Add Questions", icon: Plus },
    { id: "manage_questions", label: "Manage Bank", icon: Database },
    { id: "papers", label: "PYQ Papers", icon: FileText },
    { id: "tests", label: "Mock Tests", icon: GraduationCap },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "upload", label: "Upload PDFs", icon: Upload },
    { id: "ai_insights", label: "AI Insights", icon: BrainCircuit },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex bg-[#070A13] min-h-screen text-slate-300 font-sans">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#0D121F] border-r border-slate-800 flex flex-col sticky top-0 h-screen z-40 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-white italic tracking-tighter uppercase">Admin<span className="text-cyan-400">Panel</span></span>
            </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500">
            {isSidebarOpen ? <ChevronRight className="rotate-180" /> : <ChevronRight />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative",
                activeTab === item.id 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", activeTab === item.id && "scale-110")} />
              {isSidebarOpen && <span className="text-sm font-black italic uppercase tracking-widest">{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && (
                <motion.div layoutId="activeMenu" className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className={cn("flex items-center gap-4", !isSidebarOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-cyan-400/20 p-1">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full rounded-full" />
            </div>
            {isSidebarOpen && (
              <div>
                <p className="text-xs font-black text-white italic uppercase tracking-tighter">System Admin</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Flust786@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-[#070A13]/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="GLOBAL SEARCH..."
                className="bg-slate-900/50 border border-slate-800/50 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white font-black italic tracking-widest focus:border-cyan-500/50 outline-none w-64 transition-all"
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:text-white transition-colors">
              <Sparkles className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full border-2 border-[#070A13]"></span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && <Overview />}
              {activeTab === "questions" && <AddQuestionForm />}
              {activeTab === "manage_questions" && <ManageBank />}
              {activeTab === "tests" && <MockTestCreator />}
              {activeTab === "analytics" && <AnalyticsView />}
              {activeTab === "upload" && <UploadModule />}
              {activeTab === "students" && <StudentsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function Overview() {
  const stats = [
    { label: "Total Questions", value: "48,290", change: "+12.5%", icon: Database, color: "text-blue-400" },
    { label: "Active Students", value: "14,290", change: "+4.2%", icon: Users, color: "text-emerald-400" },
    { label: "Avg. Scores", value: "542/720", change: "+2.1%", icon: TrendingUp, color: "text-cyan-400" },
    { label: "Mock tests", value: "842", change: "Global", icon: GraduationCap, color: "text-purple-400" },
  ];

  const chartData = [
    { name: "Mon", users: 4000, attempts: 2400 },
    { name: "Tue", users: 3000, attempts: 1398 },
    { name: "Wed", users: 2000, attempts: 9800 },
    { name: "Thu", users: 2780, attempts: 3908 },
    { name: "Fri", users: 1890, attempts: 4800 },
    { name: "Sat", users: 2390, attempts: 3800 },
    { name: "Sun", users: 3490, attempts: 4300 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#0D121F] border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20", stat.color.replace('text', 'bg'))} />
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded-lg uppercase tracking-widest">{stat.change}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Engagement <span className="text-cyan-400">Analytics</span></h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-cyan-500 text-white text-[10px] font-black italic uppercase tracking-widest">7D</button>
              <button className="px-3 py-1 rounded-lg bg-white/5 text-slate-500 text-[10px] font-black italic uppercase tracking-widest">30D</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0D121F", borderColor: "#1e293b", borderRadius: "1rem" }}
                  itemStyle={{ fontSize: "12px", fontFamily: "inherit" }}
                />
                <Area type="monotone" dataKey="attempts" stroke="#06b6d4" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Progress List */}
        <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">System <span className="text-emerald-400">Health</span></h3>
          <div className="space-y-6">
            <HealthItem label="Question Verification" progress={92} color="bg-cyan-500" />
            <HealthItem label="AI Explanation Accuracy" progress={85} color="bg-emerald-500" />
            <HealthItem label="Sync Success Rate" progress={99} color="bg-blue-500" />
            <HealthItem label="Content Coverage" progress={76} color="bg-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthItem({ label, progress, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
        <span>{label}</span>
        <span className="text-white">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}

function AddQuestionForm() {
  const [formData, setFormData] = useState<Partial<Question>>({
    subject: "Biology",
    difficulty: "Medium",
    options: ["", "", "", ""],
    correctIndex: 0,
    marks: 4,
    negativeMarks: -1,
    estimatedTime: 60
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAISuggest = async () => {
    if (!formData.topic) return alert("Please enter a topic first!");
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: formData.topic, 
          subject: formData.subject,
          difficulty: formData.difficulty
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setFormData({
        ...formData,
        text: data.text,
        options: data.options,
        correctIndex: data.correctIndex,
        solution: data.solution,
        ncertRef: data.ncertRef,
        tags: data.tags,
        estimatedTime: data.estimatedTime
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate AI question.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (published: boolean = true) => {
    try {
      await addDoc(collection(db, "questions"), {
        ...formData,
        status: published ? "published" : "draft",
        createdAt: serverTimestamp()
      });
      alert("Question Added Successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem]">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">MCQ <span className="text-cyan-400">Creator Engine</span></h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manual entry or AI-assisted content generation</p>
        </div>
        <button 
          onClick={handleAISuggest}
          disabled={isGenerating}
          className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-black italic uppercase tracking-widest text-white shadow-xl shadow-cyan-900/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Clock className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isGenerating ? "Processing..." : "AI Intelligence Suggest"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standard Fields */}
        <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormInput 
              label="Subject" 
              type="select" 
              value={formData.subject} 
              options={["Physics", "Chemistry", "Botany", "Zoology"]}
              onChange={(v) => setFormData({...formData, subject: v})}
            />
            <FormInput 
              label="Difficulty" 
              type="select" 
              value={formData.difficulty} 
              options={["Easy", "Medium", "Hard"]}
              onChange={(v) => setFormData({...formData, difficulty: v})}
            />
          </div>
          <FormInput 
            label="Chapter Name" 
            placeholder="E.G., GENETICS - MOLECULAR BASIS" 
            value={formData.chapter}
            onChange={(v) => setFormData({...formData, chapter: v})}
          />
          <FormInput 
            label="Topic / Keyword" 
            placeholder="E.G., DNA REPLICATION" 
            value={formData.topic}
            onChange={(v) => setFormData({...formData, topic: v})}
          />
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Question Content (LaTeX Support)</label>
            <textarea 
              rows={5}
              className="w-full bg-[#070A13] border border-slate-800 rounded-2xl py-4 px-6 text-white font-medium outline-none focus:border-cyan-500 transition-all font-mono text-sm"
              placeholder="Type your question text here..."
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
            />
          </div>
        </div>

        {/* Options & Answers */}
        <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Options</label>
              <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Select correct answer</span>
            </div>
            {formData.options?.map((opt, idx) => (
              <div key={idx} className="flex gap-4 items-center">
                <button 
                  onClick={() => setFormData({...formData, correctIndex: idx})}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black italic shrink-0 transition-all",
                    formData.correctIndex === idx ? "bg-cyan-500 text-white shadow-lg shadow-cyan-900/40 scale-110" : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                  )}
                >
                  {String.fromCharCode(65 + idx)}
                </button>
                <input 
                  className="flex-1 bg-[#070A13] border border-slate-800 rounded-xl py-3 px-6 text-white text-sm outline-none focus:border-cyan-500 transition-all"
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...(formData.options || [])];
                    newOpts[idx] = e.target.value;
                    setFormData({...formData, options: newOpts});
                  }}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-6 border-t border-slate-800/50">
             <FormInput 
              label="NCERT Reference" 
              placeholder="E.G., CLASS XII, PAGE 92" 
              value={formData.ncertRef}
              onChange={(v) => setFormData({...formData, ncertRef: v})}
            />
             <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Detailed Solution</label>
              <textarea 
                rows={3}
                className="w-full bg-[#070A13] border border-slate-800 rounded-2xl py-4 px-6 text-white font-medium outline-none focus:border-cyan-500 transition-all text-sm"
                placeholder="Explain the logic..."
                value={formData.solution}
                onChange={(e) => setFormData({...formData, solution: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-6 h-16 sticky bottom-8 z-20">
        <button className="px-10 rounded-2xl font-black italic uppercase tracking-widest text-slate-500 hover:text-white transition-all">Clear All</button>
        <button 
          onClick={() => handleSave(false)}
          className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-10 rounded-2xl font-black italic uppercase tracking-widest text-white transition-all"
        >
          <Save className="w-5 h-5" />
          Save Draft
        </button>
        <button 
          onClick={() => handleSave(true)}
          className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 px-10 rounded-2xl font-black italic uppercase tracking-widest text-white shadow-xl shadow-emerald-900/20 transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          Publish Question
        </button>
      </div>
    </div>
  );
}

function FormInput({ label, type = "text", placeholder, options, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">{label}</label>
      {type === "select" ? (
        <select 
          className="w-full bg-[#070A13] border border-slate-800 rounded-2xl py-4 px-6 text-white font-black italic tracking-widest outline-none focus:border-cyan-500 transition-all uppercase appearance-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type}
          placeholder={placeholder}
          className="w-full bg-[#070A13] border border-slate-800 rounded-2xl py-4 px-6 text-white font-black italic tracking-widest outline-none focus:border-cyan-500 transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function ManageBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(20));
      const snap = await getDocs(q);
      setQuestions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question)));
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  return (
    <div className="bg-[#0D121F] border border-slate-800 rounded-[2.5rem] overflow-hidden">
      <div className="p-8 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Question <span className="text-cyan-400">Inventory</span></h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-slate-500 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest italic">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest italic">
            <Upload className="w-4 h-4" /> Bulk Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#070A13]/50">
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Question ID</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Subject</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Chapter</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Difficulty</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Status</th>
              <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {questions.map((q) => (
              <tr key={q.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-white transition-colors">{q.id.slice(0, 8)}...</span>
                </td>
                <td className="p-6">
                  <span className={cn(
                    "text-[10px] font-black uppercase px-3 py-1 rounded-full italic tracking-widest",
                    q.subject === "Physics" ? "bg-blue-500/10 text-blue-400" :
                    q.subject === "Chemistry" ? "bg-purple-500/10 text-purple-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  )}>
                    {q.subject}
                  </span>
                </td>
                <td className="p-6 text-sm font-black text-white italic uppercase tracking-tighter">{q.chapter}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", 
                      q.difficulty === "Easy" ? "bg-emerald-400" : q.difficulty === "Medium" ? "bg-yellow-400" : "bg-red-400"
                    )} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{q.difficulty}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded-lg uppercase tracking-widest">PUBLISHED</span>
                </td>
                <td className="p-6 text-right">
                  <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MockTestCreator() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTest, setEditingTest] = useState<Partial<MockTest> | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiCriteria, setAiCriteria] = useState({
    totalQuestions: 180,
    physicsRatio: 25,
    chemistryRatio: 25,
    biologyRatio: 50,
    difficultyMix: { easy: 30, medium: 50, hard: 20 }
  });

  useEffect(() => {
    fetchTests();
    fetchAllQuestions();
  }, []);

  const fetchTests = async () => {
    const q = query(collection(db, "mockTests"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setTests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockTest)));
    setLoading(false);
  };

  const fetchAllQuestions = async () => {
    const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setAllQuestions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question)));
  };

  const handleCreateNew = () => {
    setEditingTest({
      title: "",
      type: "Full Syllabus",
      duration: 180,
      questionIds: [],
      status: "draft",
      randomizeQuestions: true,
      releaseDate: new Date().toISOString().split('T')[0]
    });
    setIsEditing(true);
  };

  const handleSmartGenerate = () => {
    setIsAIGenerating(true);
    
    setTimeout(() => {
      const selectedIds: string[] = [];
      const subjects = ["Physics", "Chemistry", "Biology"]; 
      
      subjects.forEach(sub => {
        let ratio = sub === "Physics" ? aiCriteria.physicsRatio : 
                    sub === "Chemistry" ? aiCriteria.chemistryRatio : aiCriteria.biologyRatio;
        
        const count = Math.floor((aiCriteria.totalQuestions * ratio) / 100);
        
        const subQuestions = allQuestions.filter(q => {
          if (sub === "Biology") return q.subject === "Botany" || q.subject === "Zoology";
          return q.subject === sub;
        });

        // Group by chapters for better topic coverage
        const chapterGroups: Record<string, Question[]> = {};
        subQuestions.forEach(q => {
          if (!chapterGroups[q.chapter]) chapterGroups[q.chapter] = [];
          chapterGroups[q.chapter].push(q);
        });

        const chapters = Object.keys(chapterGroups);
        if (chapters.length === 0) return;

        // Determine how many questions per chapter roughly
        const TargetPerChapter = Math.max(1, Math.ceil(count / chapters.length));

        // Fill based on difficulty mix while cycling through chapters
        const difficulties = ["Easy", "Medium", "Hard"];
        difficulties.forEach(diff => {
          const diffRatio = diff === "Easy" ? aiCriteria.difficultyMix.easy :
                            diff === "Medium" ? aiCriteria.difficultyMix.medium : aiCriteria.difficultyMix.hard;
          const diffCount = Math.floor((count * diffRatio) / 100);
          
          let subDiffQuestions = subQuestions.filter(q => q.difficulty === diff);
          // Shuffle chapters to avoid bias
          const shuffledChapters = [...chapters].sort(() => Math.random() - 0.5);
          
          let added = 0;
          let chapterIdx = 0;
          while (added < diffCount && subDiffQuestions.length > 0) {
            const chap = shuffledChapters[chapterIdx % shuffledChapters.length];
            const chapQuestions = subDiffQuestions.filter(q => q.chapter === chap);
            
            if (chapQuestions.length > 0) {
              const q = chapQuestions[Math.floor(Math.random() * chapQuestions.length)];
              selectedIds.push(q.id);
              subDiffQuestions = subDiffQuestions.filter(sq => sq.id !== q.id);
              added++;
            } else {
              // If no more questions in this chapter with this difficulty, try next
              // But we need a way to break if no questions at all
              const remainingInOtherChaps = subDiffQuestions.some(sq => shuffledChapters.includes(sq.chapter));
              if (!remainingInOtherChaps) break;
            }
            chapterIdx++;
          }
        });
      });

      if (editingTest) {
        setEditingTest({
          ...editingTest,
          questionIds: [...new Set([...(editingTest.questionIds || []), ...selectedIds])]
        });
      }
      
      setIsAIGenerating(false);
      alert(`AI optimized the test architecture: ${selectedIds.length} questions across ${allQuestions.length} bank entries have been intelligently distributed by subject, difficulty, and topic.`);
    }, 1500);
  };

  const handleSaveTest = async () => {
    if (!editingTest?.title) return alert("Title is required");
    
    try {
      const dataToSave = {
        ...editingTest,
        updatedAt: serverTimestamp()
      };

      if (editingTest.id) {
        await updateDoc(doc(db, "mockTests", editingTest.id), dataToSave);
      } else {
        await addDoc(collection(db, "mockTests"), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      setIsEditing(false);
      setEditingTest(null);
      fetchTests();
      alert("Test saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving test");
    }
  };

  const toggleQuestionInTest = (qId: string) => {
    if (!editingTest) return;
    const currentIds = [...(editingTest.questionIds || [])];
    const index = currentIds.indexOf(qId);
    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(qId);
    }
    setEditingTest({ ...editingTest, questionIds: currentIds });
  };

  if (isEditing && editingTest) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEditing(false)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              {editingTest.id ? "Edit" : "Architect"} <span className="text-purple-400">Mock Test</span>
            </h2>
          </div>
          <button 
            onClick={handleSmartGenerate}
            disabled={isAIGenerating}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 rounded-xl font-black italic uppercase tracking-widest text-white shadow-xl shadow-purple-900/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {isAIGenerating ? <Clock className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            AI Smart Build
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
              <FormInput 
                label="Test Title" 
                placeholder="E.G., UNIT TEST-1: PHYSICS"
                value={editingTest.title}
                onChange={(v: any) => setEditingTest({...editingTest, title: v})}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                  label="Test Type" 
                  type="select" 
                  options={["Full Syllabus", "Chapter Test", "Daily Quiz", "Sectional"]}
                  value={editingTest.type}
                  onChange={(v: any) => setEditingTest({...editingTest, type: v})}
                />
                <FormInput 
                  label="Duration (Min)" 
                  type="number"
                  value={editingTest.duration}
                  onChange={(v: any) => setEditingTest({...editingTest, duration: parseInt(v)})}
                />
              </div>
              
              <FormInput 
                label="Release Schedule" 
                type="date"
                value={editingTest.releaseDate}
                onChange={(v: any) => setEditingTest({...editingTest, releaseDate: v})}
              />

              <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-[10px] font-black text-white italic uppercase tracking-widest">Randomize Questions</span>
                </div>
                <button 
                  onClick={() => setEditingTest({...editingTest, randomizeQuestions: !editingTest.randomizeQuestions})}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-all duration-300",
                    editingTest.randomizeQuestions ? "bg-cyan-500" : "bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 bg-white rounded-full transition-all duration-300 transform",
                    editingTest.randomizeQuestions ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800/50">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-2">Build Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold italic">
                    <span className="text-slate-500">QUESTIONS SELECTED:</span>
                    <span className="text-cyan-400">{editingTest.questionIds?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold italic">
                    <span className="text-slate-500">MAX SCORE:</span>
                    <span className="text-white">{(editingTest.questionIds?.length || 0) * 4}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSaveTest}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-black italic uppercase tracking-widest text-white shadow-xl shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Commit to Database
              </button>
            </div>

            {/* AI Criteria Configuration (Visible when AIGen is triggered or persistent) */}
            <div className="bg-slate-900/30 border border-slate-800/50 p-6 rounded-[2rem] space-y-4">
               <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest italic flex items-center gap-2">
                 <BrainCircuit className="w-3 h-3" /> AI Build Criteria
               </h4>
               <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] font-bold text-slate-500 mb-1 uppercase">PHYSICS</p>
                    <input 
                      type="number" 
                      className="w-full bg-transparent text-center text-xs font-black text-white outline-none" 
                      value={aiCriteria.physicsRatio}
                      onChange={(e) => setAiCriteria({...aiCriteria, physicsRatio: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] font-bold text-slate-500 mb-1 uppercase">CHEMISTRY</p>
                    <input 
                      type="number" 
                      className="w-full bg-transparent text-center text-xs font-black text-white outline-none" 
                      value={aiCriteria.chemistryRatio}
                      onChange={(e) => setAiCriteria({...aiCriteria, chemistryRatio: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded-xl">
                    <p className="text-[8px] font-bold text-slate-500 mb-1 uppercase">BIOLOGY</p>
                    <input 
                      type="number" 
                      className="w-full bg-transparent text-center text-xs font-black text-white outline-none" 
                      value={aiCriteria.biologyRatio}
                      onChange={(e) => setAiCriteria({...aiCriteria, biologyRatio: parseInt(e.target.value)})}
                    />
                  </div>
               </div>
               <div className="pt-2">
                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2">Difficulty MIX (E/M/H %)</p>
                 <div className="flex gap-2">
                    <input className="w-full bg-white/5 border border-slate-800 rounded-lg p-2 text-xs font-black text-emerald-400 text-center" value={aiCriteria.difficultyMix.easy} onChange={(e) => setAiCriteria({...aiCriteria, difficultyMix: {...aiCriteria.difficultyMix, easy: parseInt(e.target.value)}})} />
                    <input className="w-full bg-white/5 border border-slate-800 rounded-lg p-2 text-xs font-black text-yellow-400 text-center" value={aiCriteria.difficultyMix.medium} onChange={(e) => setAiCriteria({...aiCriteria, difficultyMix: {...aiCriteria.difficultyMix, medium: parseInt(e.target.value)}})} />
                    <input className="w-full bg-white/5 border border-slate-800 rounded-lg p-2 text-xs font-black text-red-400 text-center" value={aiCriteria.difficultyMix.hard} onChange={(e) => setAiCriteria({...aiCriteria, difficultyMix: {...aiCriteria.difficultyMix, hard: parseInt(e.target.value)}})} />
                 </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-[#0D121F] border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px]">
             <div className="p-8 border-b border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Question <span className="text-cyan-400">Inventory Bank</span></h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="SEARCH QUESTIONS..."
                      className="bg-[#070A13] border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-[10px] text-white font-black italic tracking-widest outline-none focus:border-cyan-500 transition-all w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["All", "Physics", "Chemistry", "Biology", "Botany", "Zoology"].map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSubjectFilter(sub)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border",
                        subjectFilter === sub 
                          ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-900/20" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      )}
                    >
                      {sub}
                    </button>
                  ))}
                  <div className="w-px h-4 bg-slate-800 mx-2 self-center" />
                  {["All", "Easy", "Medium", "Hard"].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setDifficultyFilter(diff)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border",
                        difficultyFilter === diff 
                          ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-900/20" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                  
                  <div className="ml-auto flex gap-2">
                    <button 
                      onClick={() => {
                        const filtered = allQuestions.filter(q => {
                          const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesSubject = subjectFilter === "All" || q.subject === subjectFilter;
                          const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
                          return matchesSearch && matchesSubject && matchesDifficulty;
                        });
                        const currentIds = new Set(editingTest.questionIds || []);
                        filtered.forEach(q => currentIds.add(q.id));
                        setEditingTest({...editingTest, questionIds: Array.from(currentIds)});
                      }}
                      className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border bg-slate-900 border-slate-800 text-cyan-400 hover:border-cyan-500/50"
                    >
                      Select Filtered
                    </button>
                    <button 
                      onClick={() => setEditingTest({...editingTest, questionIds: []})}
                      className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border bg-slate-900 border-slate-800 text-red-400 hover:border-red-500/50"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-4 max-h-[700px]">
                {allQuestions
                  .filter(q => {
                    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                         q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesSubject = subjectFilter === "All" || q.subject === subjectFilter;
                    const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
                    return matchesSearch && matchesSubject && matchesDifficulty;
                  })
                  .map((q) => {
                  const isSelected = editingTest.questionIds?.includes(q.id);
                  return (
                    <div 
                      key={q.id} 
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer group",
                        isSelected 
                          ? "bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-900/10" 
                          : "bg-slate-900/30 border-slate-800 hover:border-slate-700"
                      )}
                      onClick={() => toggleQuestionInTest(q.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                              q.subject === "Physics" ? "bg-blue-500/20 text-blue-400" :
                              q.subject === "Chemistry" ? "bg-purple-500/20 text-purple-400" :
                              q.subject === "Biology" || q.subject === "Botany" || q.subject === "Zoology" ? "bg-emerald-500/20 text-emerald-400" :
                              "bg-slate-500/20 text-slate-400"
                            )}>{q.subject}</span>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">{q.chapter}</span>
                            <div className={cn("w-1.5 h-1.5 rounded-full ml-auto", 
                              q.difficulty === "Easy" ? "bg-emerald-400" : q.difficulty === "Medium" ? "bg-yellow-400" : "bg-red-400"
                            )} />
                          </div>
                          <p className="text-sm font-medium text-slate-200 line-clamp-2">{q.text}</p>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                          isSelected ? "bg-cyan-500 border-cyan-500 text-white" : "border-slate-700 group-hover:border-slate-500"
                        )}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Mock Test <span className="text-purple-400">Architect</span></h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Deploy high-precision exam simulations</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-3 bg-purple-500 hover:bg-purple-400 px-8 py-4 rounded-2xl font-black italic uppercase tracking-widest text-white shadow-xl shadow-purple-900/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Test Structure
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Clock className="w-10 h-10 text-slate-700 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest italic">Syncing Tests...</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[3rem]">
            <Database className="w-12 h-12 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 font-black uppercase tracking-widest italic">No tests found in database</p>
            <button onClick={handleCreateNew} className="mt-4 text-cyan-400 font-bold italic uppercase tracking-widest hover:underline px-4 py-2">Create your first test</button>
          </div>
        ) : (
          tests.map(test => (
            <div key={test.id} className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/30 transition-all flex flex-col">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingTest(test); setIsEditing(true); }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 font-black italic shrink-0">MT</div>
              <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2 line-clamp-1">{test.title}</h4>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
                <span className="flex items-center gap-2"><Clock className="w-3 h-3"/> {test.duration} Min</span>
                <span className="flex items-center gap-2"><Database className="w-3 h-3"/> {test.questionIds?.length || 0} Qs</span>
                {test.releaseDate && (
                  <span className="flex items-center gap-2 text-cyan-500/80"><Clock className="w-3 h-3"/> {test.releaseDate}</span>
                )}
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                <div className="flex gap-2">
                  <span className={cn(
                    "text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest",
                    test.status === "published" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
                  )}>
                    {test.status}
                  </span>
                  {test.randomizeQuestions && (
                    <span className="text-[8px] font-black px-2 py-1 rounded bg-blue-400/10 text-blue-400 uppercase tracking-widest italic">
                      Random
                    </span>
                  )}
                </div>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest italic">ID: {test.id.slice(0, 6)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AnalyticsView() {
  const data = [
    { name: "Genetics", count: 85 },
    { name: "Mechanics", count: 72 },
    { name: "Organic", count: 94 },
    { name: "Optics", count: 61 },
    { name: "Diversity", count: 98 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] space-y-8">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Content <span className="text-cyan-400">Distribution</span></h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0D121F", borderColor: "#1e293b", borderRadius: "1rem" }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 10, 10, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] space-y-8">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Usage <span className="text-emerald-400">Heatmap</span></h3>
        <div className="flex items-center justify-center h-[320px] text-slate-500 italic font-medium uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-[2rem]">
          Interactive analytics chart rendering...
        </div>
      </div>
    </div>
  );
}

function UploadModule() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#0D121F] border border-slate-800 p-12 rounded-[3rem] border-dashed flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-cyan-400/10 rounded-[2rem] flex items-center justify-center text-cyan-400">
          <Upload className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">PDF Bulk <span className="text-cyan-400">Import</span></h3>
          <p className="text-sm text-slate-500 max-w-sm mt-2 font-medium italic">Our AI engine automatically extracts questions, images, and solutions from standard exam PDFs.</p>
        </div>
        <button className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-3xl font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-cyan-400/20">
          Select Source Files
        </button>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Supported formats: PDF, DOCX, XLSX (MAX 50MB)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-400/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <FileText className="w-7 h-7" />
          </div>
          <div>
             <h4 className="text-sm font-black text-white italic uppercase tracking-widest">OCR Pipeline</h4>
             <p className="text-xs text-slate-500 italic mt-1 font-medium">Auto-convert paper scans to digital bank</p>
          </div>
        </div>
        <div className="bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-400/10 rounded-2xl flex items-center justify-center text-blue-400">
            <BrainCircuit className="w-7 h-7" />
          </div>
          <div>
             <h4 className="text-sm font-black text-white italic uppercase tracking-widest">Chapter Tagging</h4>
             <p className="text-xs text-slate-500 italic mt-1 font-medium">Automatic categorization of extracted data</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentsView() {
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch mock
    setStudents([
      { name: "Rahul S.", email: "rahul@example.com", score: "682", plan: "PRO", status: "Active" },
      { name: "Ananya K.", email: "ananya@example.com", score: "542", plan: "FREE", status: "Inactive" },
      { name: "Vivek M.", email: "vivek@example.com", score: "710", plan: "PRO", status: "Active" },
    ]);
  }, []);

  return (
    <div className="bg-[#0D121F] border border-slate-800 rounded-[2.5rem] overflow-hidden">
       <div className="p-8 border-b border-slate-800">
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Student <span className="text-cyan-400">Directory</span></h3>
      </div>
      <div className="p-8 space-y-4">
        {students.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-black italic text-cyan-400">
                {s.name[0]}
              </div>
              <div>
                <p className="font-black text-white italic uppercase tracking-tighter">{s.name}</p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{s.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-white italic tracking-tighter">{s.score}</p>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">AVG SCORE</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={cn(
                "text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest italic",
                s.plan === "PRO" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-slate-800 text-slate-400"
              )}>
                {s.plan} Plan
              </span>
              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}
