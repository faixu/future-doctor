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
  Layout
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn } from "../lib/utils";

interface MockTest {
  id: string;
  title: string;
  type: string;
  duration: number;
  questionIds: string[];
  createdAt: any;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("tests");
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingTest, setIsAddingTest] = useState(false);
  const [newTest, setNewTest] = useState({ title: "", type: "Full Syllabus", duration: 180 });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const q = query(collection(db, "mockTests"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const testData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockTest));
      setTests(testData);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "mockTests"), {
        ...newTest,
        questionIds: [],
        createdAt: new Date().toISOString()
      });
      setIsAddingTest(false);
      setNewTest({ title: "", type: "Full Syllabus", duration: 180 });
      fetchTests();
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;
    try {
      await deleteDoc(doc(db, "mockTests", id));
      fetchTests();
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-cyan-400">Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">System <span className="text-cyan-400">Dashboard</span></h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#0D121F] border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4">
            <Users className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active Users</p>
              <p className="text-sm font-black text-white italic">14,290</p>
            </div>
          </div>
          <div className="bg-[#0D121F] border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4">
            <Database className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">DB Health</p>
              <p className="text-sm font-black text-emerald-400 italic">OPTIMAL</p>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Tabs */}
      <div className="flex gap-4 border-b border-slate-800">
        <TabButton active={activeTab === "tests"} onClick={() => setActiveTab("tests")} label="Mock Tests" icon={Layout} />
        <TabButton active={activeTab === "questions"} onClick={() => setActiveTab("questions")} label="Question Bank" icon={Database} />
        <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")} label="User Management" icon={Users} />
      </div>

      <main className="min-h-[600px]">
        {activeTab === "tests" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="SEARCH MOCK TESTS..."
                  className="w-full bg-[#0D121F] border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white font-black italic tracking-widest outline-none focus:border-cyan-500 transition-all"
                />
              </div>
              <button 
                onClick={() => setIsAddingTest(true)}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-xl font-black italic uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/20"
              >
                <Plus className="w-5 h-5" />
                New Mock Test
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {tests.map((test) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={test.id}
                    className="bg-[#0D121F] border border-slate-800 p-6 rounded-[2rem] hover:border-cyan-500/30 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-cyan-400 bg-cyan-500/5 px-2 py-1 rounded-lg italic border border-cyan-500/10 uppercase tracking-widest">
                        {test.type}
                      </span>
                      <div className="flex gap-2">
                        <button className="text-slate-500 hover:text-white transition-colors p-1"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteTest(test.id)} className="text-slate-500 hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-white italic tracking-tight uppercase mb-2">{test.title}</h3>
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800/50">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        {test.questionIds?.length || 0} Questions
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                        {test.duration} MINS
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab !== "tests" && (
          <div className="flex items-center justify-center h-[400px] text-slate-500 italic font-medium uppercase tracking-widest border-2 border-dashed border-slate-800 rounded-[2rem]">
            Management module coming soon...
          </div>
        )}
      </main>

      {/* Add Test Modal */}
      <AnimatePresence>
        {isAddingTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsAddingTest(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#0D121F] border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Create <span className="text-cyan-400">New Test</span></h2>
              <form onSubmit={handleAddTest} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Test Title</label>
                  <input 
                    required
                    value={newTest.title}
                    onChange={e => setNewTest({...newTest, title: e.target.value})}
                    type="text" 
                    placeholder="E.G., FULL SYLLABUS MOCK #01"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 px-6 text-white font-black italic tracking-widest outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Type</label>
                    <select 
                      value={newTest.type}
                      onChange={e => setNewTest({...newTest, type: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 px-6 text-white font-black italic tracking-widest outline-none focus:border-cyan-500 uppercase"
                    >
                      <option>Full Syllabus</option>
                      <option>Chapter Test</option>
                      <option>Daily Quiz</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Duration (Min)</label>
                    <input 
                      required
                      value={newTest.duration}
                      onChange={e => setNewTest({...newTest, duration: parseInt(e.target.value)})}
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 px-6 text-white font-black italic tracking-widest outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddingTest(false)}
                    className="flex-1 px-6 py-4 rounded-xl font-black italic uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-4 rounded-xl font-black italic uppercase tracking-widest transition-all shadow-xl shadow-cyan-900/20"
                  >
                    Create Test
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, label, icon: Icon, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-6 py-4 transition-all relative",
        active ? "text-cyan-400" : "text-slate-500 hover:text-slate-300"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[11px] font-black uppercase tracking-widest italic">{label}</span>
      {active && (
        <motion.div 
          layoutId="adminTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400"
        />
      )}
    </button>
  );
}
