import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Trash2, 
  User, 
  Sparkles, 
  RefreshCw, 
  Bookmark, 
  Clock, 
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { Message } from "../types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onClearChat: () => void;
  onLogUnanswered?: (question: string, aiResponse: string, reportedBy: "auto" | "user") => void;
}

// Custom parser to format WhatsApp-style *bold* and markdown **bold** or bullet points nicely.
function formatChatMessage(text: string) {
  if (!text) return "";
  
  // Convert standard newlines to JSX linebreaks or paragraph elements.
  const lines = text.split("\n");
  
  return lines.map((line, idx) => {
    let formattedLine = line;
    
    // Replace **bold** with strong
    formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    
    // Replace WhatsApp-style *bold* with strong
    formattedLine = formattedLine.replace(/(?<!\w)\*(?!\s)(.*?)(?<!\s)\*(?!\w)/g, "<strong>$1</strong>");
    
    // Replace custom emojis to render properly
    formattedLine = formattedLine.replace(/smataqwsb\[at\]gmail\.com/g, "smataqwsb@gmail.com");

    const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ") || line.trim().startsWith("• ");
    
    if (isBullet) {
      const cleanText = line.trim().substring(2);
      return (
        <li key={idx} className="list-disc ml-5 my-0.5 text-xs text-slate-700 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[-*•]\s*/, "") }} />
        </li>
      );
    }
    
    return (
      <p 
        key={idx} 
        className={`text-xs text-slate-700 leading-relaxed ${line.trim() === "" ? "h-2" : "my-1"}`}
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    );
  });
}

export default function ChatWindow({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  onLogUnanswered
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReportUnanswered = (question: string, aiResponse: string, msgId: string) => {
    if (onLogUnanswered) {
      onLogUnanswered(question, aiResponse, "user");
    }
    setReportedIds(prev => [...prev, msgId]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Top Header representing Asha */}
      <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200 shadow-inner text-emerald-800 font-bold overflow-hidden">
              <span className="text-sm font-extrabold">AS</span>
            </div>
            {/* Active pulsing green indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-emerald-800 rounded-full" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-sans tracking-tight leading-tight flex items-center gap-1.5">
              Asha • Asisten Virtual SMATAQ
              <Sparkles size={11} className="text-amber-300 animate-pulse" />
            </h3>
            <p className="text-[10px] text-emerald-100/90 font-medium">
              Aktif Menjawab • Ramah, Sopan & Solutif
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClearChat}
          id="clear-chat-btn"
          disabled={messages.length === 1 && !isLoading}
          className="p-2 gap-1 rounded-xl text-emerald-100 hover:bg-emerald-700 hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-transparent text-xs font-semibold flex items-center cursor-pointer"
          title="Mulai Ulang Percakapan"
        >
          <Trash2 size={13} />
          <span className="hidden sm:inline">Bersihkan</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 bg-[#efeae2]/15 relative">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isAsha = msg.role === "assistant";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                id={`message-${msg.id}`}
                className={`flex gap-3 max-w-[85%] ${
                  isAsha ? "mr-auto flex-row" : "ml-auto flex-row-reverse"
                }`}
              >
                {/* Profile Avatars inside chat bubbles */}
                <div 
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold shadow-sm ${
                    isAsha 
                      ? "bg-brand-500 text-white" 
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isAsha ? "A" : <User size={12} />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl shadow-sm border ${
                      isAsha
                        ? "bg-white border-slate-100 rounded-tl-none text-slate-800"
                        : "bg-emerald-600 border-emerald-500 rounded-tr-none text-white"
                    }`}
                  >
                    {/* Display formatted response */}
                    {isAsha ? (
                      <div className="space-y-1">
                        {formatChatMessage(msg.content)}
                      </div>
                    ) : (
                      <p className="text-xs font-medium leading-relaxed break-words">
                        {msg.content}
                      </p>
                    )}
                  </div>
                  
                  {/* Message timestamp metadata */}
                  <div className={`flex items-center gap-1.5 text-[9px] text-slate-400 font-medium px-1 ${
                    isAsha ? "justify-start" : "justify-end"
                  }`}>
                    <Clock size={9} />
                    <span>{msg.timestamp}</span>
                    {!isAsha && <CheckCheck size={11} className="text-emerald-500 ml-0.5" />}
                  </div>

                  {/* Feedback button for unanswered query */}
                  {isAsha && index > 0 && messages[index - 1]?.role === "user" && (
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <button
                        type="button"
                        onClick={() => handleReportUnanswered(messages[index - 1].content, msg.content, msg.id)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 border ${
                          reportedIds.includes(msg.id)
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "text-slate-400 border-transparent hover:text-amber-700 hover:bg-amber-50/50 hover:border-amber-200"
                        }`}
                        disabled={reportedIds.includes(msg.id)}
                      >
                        <AlertCircle size={9.5} />
                        {reportedIds.includes(msg.id) ? "Tercatat di Admin" : "Jawaban Kurang Sesuai / Belum Ada Data?"}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Bouncing typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-[85%] mr-auto"
            id="typing-indicator"
          >
            <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex-shrink-0 flex items-center justify-center text-[11px] font-bold shadow-sm">
              A
            </div>
            <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-semibold mr-1">Asha sedang mengetik</span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}

        {/* Bottom invisible target for scroll lock */}
      <div ref={messagesEndRef} />
    </div>

    {/* Message Input Footer Form */}
      <form
        onSubmit={handleSend}
        id="send-message-form"
        className="p-4 bg-white border-t border-slate-100 flex items-center gap-2.5"
      >
        <input
          type="text"
          id="chat-input-field"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tanyakan sesuatu ke Asha... (contoh: Beasiswa SMATAQ)"
          disabled={isLoading}
          autoComplete="off"
          className="flex-1 text-xs bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white focus:outline-none px-4 py-2.5 rounded-xl transition-all font-medium disabled:opacity-60"
        />
        <button
          type="submit"
          id="chat-submit-btn"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl shadow-sm transition-all flex items-center justify-center cursor-pointer"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
