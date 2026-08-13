import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import AdminPanel from "./components/AdminPanel";
import { Message, CustomKnowledgeItem } from "./types";
import { PROFIL_DATA, PPDB_DATA } from "./schoolData";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  GraduationCap, 
  School, 
  HelpCircle,
  ExternalLink,
  Sparkles,
  Heart,
  Settings
} from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customKnowledge, setCustomKnowledge] = useState<CustomKnowledgeItem[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Load custom knowledge data on startup
  useEffect(() => {
    const savedKnowledge = localStorage.getItem("smataq_custom_knowledge");
    if (savedKnowledge) {
      try {
        setCustomKnowledge(JSON.parse(savedKnowledge));
      } catch (e) {
        console.error("Gagal memuat basis data tambahan.");
        setCustomKnowledge([]);
      }
    } else {
      setCustomKnowledge([]);
      localStorage.setItem("smataq_custom_knowledge", JSON.stringify([]));
    }
  }, []);
  
  // Set initial welcome message
  useEffect(() => {
    const saved = localStorage.getItem("smataq_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {
        console.error("Failed to parse saved chat history.");
      }
    }

    const timeString = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: "Assalamualaikum Wr. Wb. Selamat datang di pusat informasi SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo. Saya **Asha**, asisten virtual resmi sekolah. Silakan ketik pertanyaan Anda secara langsung, saya siap membantu.",
        timestamp: timeString
      }
    ]);
  }, []);

  // Save history
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("smataq_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Function to save unanswered / unresolved questions
  const logUnansweredQuestion = (question: string, aiResponse: string, reportedBy: "auto" | "user") => {
    try {
      const savedStr = localStorage.getItem("smataq_unanswered_questions") || "[]";
      const saved = JSON.parse(savedStr);
      
      const isDuplicate = saved.some((q: any) => q.question.toLowerCase().trim() === question.toLowerCase().trim());
      if (isDuplicate) return;

      const newItem = {
        id: "unanswered-" + Date.now(),
        question: question.trim(),
        aiResponse: aiResponse.trim(),
        timestamp: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        status: "pending",
        reportedBy
      };
      const updated = [newItem, ...saved];
      localStorage.setItem("smataq_unanswered_questions", JSON.stringify(updated));
      
      // Dispatch custom event to notify Admin Panel if it is open
      window.dispatchEvent(new CustomEvent("smataq_unanswered_updated"));
    } catch (e) {
      console.error("Gagal menyimpan pertanyaan tak terjawab.", e);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const timeString = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: timeString
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Send active knowledge inputs only
      const activeKnowledge = customKnowledge.filter(item => item.isActive);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          messages: updatedMessages,
          customKnowledge: activeKnowledge
        })
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung dengan server Asha.");
      }

      const data = await response.json();
      
      const ashaTime = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      });

      // Auto-detect if response indicates missing knowledge/fallback
      const replyLower = (data.reply || "").toLowerCase();
      const lowConfidencePhrases = [
        "tidak menemukan informasi",
        "tidak tercantum dalam basis data",
        "belum memiliki informasi tersebut",
        "belum mempunyai data akademis",
        "afwan saya belum memiliki",
        "afwan, saya tidak menemukan",
        "maaf, informasi tersebut tidak",
        "tidak tertulis dalam data resmi",
        "belum dibekali informasi"
      ];
      const isAutoFlagged = lowConfidencePhrases.some(phrase => replyLower.includes(phrase));
      if (isAutoFlagged) {
        logUnansweredQuestion(content, data.reply || "", "auto");
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply || "Mohon maaf, terjadi kendala saat merespon.",
          timestamp: ashaTime
        }
      ]);
    } catch (error) {
      console.error(error);
      const ashaTime = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      });
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Afwan (mohon maaf), saya mengalami kendala koneksi saat menghubungi server sekolah. Silakan hubungi Telepon Resmi kami di **0286-3326374** atau coba kirimkan pesan kembali beberapa saat lagi.",
          timestamp: ashaTime
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const timeString = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });
    const initMessage = {
      id: "init-" + Date.now(),
      role: "assistant" as const,
      content: "Assalamualaikum Wr. Wb. Selamat datang kembali di pusat informasi SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo. Saya **Asha**, asisten virtual resmi sekolah. Ada yang bisa saya bantu?",
      timestamp: timeString
    };
    setMessages([initMessage]);
    localStorage.removeItem("smataq_chat_history");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans overflow-hidden">
      {/* Pure Dialogue Header / Nav */}
      <nav className="bg-brand-500 text-white px-8 py-4 flex flex-row justify-between items-center shadow-lg gap-4 select-none">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-500 font-extrabold text-xl shadow-inner">
            S
          </div>
          <div>
            <h1 className="text-md sm:text-lg font-bold leading-tight uppercase tracking-wider font-sans">
              SMA Takhassus Al-Qur'an
            </h1>
            <p className="text-xs text-brand-100 opacity-85">
              Wonosobo • Virtual Assistant Asha (Dialog Murni)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold">
          <button
            id="nav-admin-console"
            onClick={() => setIsAdminOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings size={13} /> Kelola Chatbot (Admin)
          </button>
        </div>
      </nav>

      {/* Main Container Area with flex row */}
      <main className="flex-1 flex gap-6 p-4 sm:p-6 overflow-hidden min-h-0">
        
        {/* Left Aside Sidebar on Desktop ("Professional Polish" specifications) */}
        <aside className="w-80 flex-shrink-0 flex flex-col gap-4 hidden lg:flex">
          {/* Slogan & Contacts Sidebar block */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex-1 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="text-brand-500">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">
                  Slogan Sekolah
                </p>
                <p className="text-md font-serif italic font-semibold leading-snug">
                  "{PROFIL_DATA.slogan}"
                </p>
              </div>

              {/* Specific details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500 flex-shrink-0">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Alamat Lengkap</p>
                    <p className="text-[11px] font-medium text-slate-600 leading-normal">
                      Jl. K.H. Asy'ari No.29, Kalibeber, Wonosobo, Jateng
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500 flex-shrink-0">
                    <Phone size={15} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Kontak Resmi</p>
                    <p className="text-[11px] font-medium text-slate-600 font-mono">
                      (0286) 3326374
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center text-brand-500 flex-shrink-0">
                    <Mail size={15} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Email Resmi</p>
                    <p className="text-[11px] font-medium text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                      smataqwsb@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alumni progression stat counter */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-2xl font-extrabold text-brand-500 leading-none">10.000+</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold">Alumni Tersebar</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[90%]" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Meluluskan santri unggul sejak tahun 1989</p>
            </div>
          </div>

          {/* Golden Output Lulusan footer block of sidebar */}
          <div className="bg-emerald-950 p-5 rounded-2xl text-white">
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-60 mb-1.5">
              Output Lulusan Terbaik
            </p>
            <p className="text-xs leading-relaxed mb-3 font-sans opacity-90">
              Alumni SMATAQ terbukti sukses menembus PTN berkredibilitas tinggi melalui SNBP, UTBK-SNBT, hingga PTKIN.
            </p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <div className="w-2 h-2 bg-emerald-600 rounded-full" />
              <div className="w-2 h-2 bg-emerald-650 rounded-full" />
            </div>
          </div>
        </aside>

        {/* Center / Chat Panel Window - Beautifully scaled width, fully responsive & roomy */}
        <div className="flex-1 h-full min-h-0 overflow-hidden">
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onLogUnanswered={logUnansweredQuestion}
          />
        </div>

      </main>

      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onUpdateKnowledge={setCustomKnowledge} 
      />
    </div>
  );
}
