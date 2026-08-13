import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as XLSX from "xlsx";
import { 
  Lock, 
  Unlock, 
  FileText, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCheck,
  AlertCircle,
  Eye,
  Settings,
  HelpCircle,
  ChevronDown,
  Info,
  X,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  FileType,
  Loader2,
  FileCheck
} from "lucide-react";
import { CustomKnowledgeItem } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateKnowledge: (items: CustomKnowledgeItem[]) => void;
}

export default function AdminPanel({ isOpen, onClose, onUpdateKnowledge }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [activeTab, setActiveTab] = useState<"add-manual" | "add-file" | "unanswered">("add-manual");
  const [unansweredList, setUnansweredList] = useState<any[]>([]);
  
  // Custom information forms
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notification, setNotification] = useState<{ status: "success" | "error"; text: string } | null>(null);

  // Lists stored in localStorage
  const [knowledgeList, setKnowledgeList] = useState<CustomKnowledgeItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parsingStatus, setParsingStatus] = useState("");

  // Load registered knowledge bases
  useEffect(() => {
    const saved = localStorage.getItem("smataq_custom_knowledge");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setKnowledgeList(parsed);
      } catch (e) {
        console.error("Gagal memuat basis data tambahan.");
      }
    } else {
      // Seed data template resmi dari web smataqwsb.sch.id
      const seedData: CustomKnowledgeItem[] = [
        {
          id: "seed-1",
          title: "Sejarah Rintisan & Sanad Keilmuan SMATAQ Wonosobo",
          content: "SMA Takhassus Al-Qur'an Wonosobo didirikan pada tahun 1989 atas bimbingan mendalam KH. Muntaha Al-Hafidz (Mbah Mun), pengasuh Pondok Pesantren Al-Asy'ariyyah Kalibeber. Beliau menginginkan lahirnya generasi Qurani yang melek teknologi (sains) namun tetap memegang teguh wirid, akhlak islami, serta kepribadian pesantren khas Nusantara.",
          sourceType: "text",
          timestamp: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          isActive: true
        },
        {
          id: "seed-2",
          title: "Sistem Setoran Tahfidz & Wisuda Khotmil Qur'an",
          content: "Setiap siswa SMATAQ wajib mengikuti setoran hafalan Al-Qur'an terpadu (Saba', Sabqi, dan Manzil) dihadapan asatidz penanggung jawab di asrama asuhan Yayasan Al-Asy'ariyyah. Wisuda khotmil Qur'an diselenggarakan berkala setiap tahun di halaman pesantren dan dihadiri ribuan wali murid serta tokoh nasional.",
          sourceType: "text",
          timestamp: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          isActive: true
        },
        {
          id: "seed-3",
          title: "Panduan Seragam Resmi Yayasan Al-Asy'ariyyah",
          content: "Ketentuan berpakaian siswa SMATAQ: \n- Senin - Selasa: Abu-Abu Putih rapi dengan songkok hitam bagi putra, jilbab kain putih bagi putri.\n- Rabu - Kamis: Batik / Kemeja kemitraan Al-Asy'ariyyah.\n- Jumat - Sabtu: Seragam Pramuka bersaku ganda / Baju muslim koko tasyiri hijau bordir.",
          sourceType: "text",
          timestamp: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
          isActive: true
        }
      ];
      setKnowledgeList(seedData);
      localStorage.setItem("smataq_custom_knowledge", JSON.stringify(seedData));
      onUpdateKnowledge(seedData);
    }
    
    // Maintain brief authentication session
    const authSaved = sessionStorage.getItem("smataq_admin_session");
    if (authSaved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Load and subscribe to unanswered questions
  useEffect(() => {
    const loadUnanswered = () => {
      const savedUnresolved = localStorage.getItem("smataq_unanswered_questions");
      if (savedUnresolved) {
        try {
          setUnansweredList(JSON.parse(savedUnresolved));
        } catch (e) {
          console.error("Gagal memuat list pertanyaan tak terjawab.");
        }
      } else {
        setUnansweredList([]);
      }
    };

    loadUnanswered();

    window.addEventListener("smataq_unanswered_updated", loadUnanswered);
    return () => {
      window.removeEventListener("smataq_unanswered_updated", loadUnanswered);
    };
  }, []);

  const handleDownloadUnanswered = () => {
    if (unansweredList.length === 0) {
      alert("Tidak ada pertanyaan yang belum dijawab untuk diunduh!");
      return;
    }
    
    let textContent = "========================================================\n";
    textContent += "PERTANYAAN BELUM TERJAWAB / PERLU INFORMASI PENDUKUNG\n";
    textContent += "SMA TAKHASSUS AL-QUR'AN (SMATAQ) WONOSOBO\n";
    textContent += `Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}\n`;
    textContent += "========================================================\n\n";
    
    unansweredList.forEach((item, idx) => {
      textContent += `${idx + 1}. PERTANYAAN: "${item.question}"\n`;
      textContent += `   Waktu Laporan : ${item.timestamp}\n`;
      textContent += `   Sumber Laporan: ${item.reportedBy === "auto" ? "Deteksi Otomatis (Asha)" : "Laporan Manual (User)"}\n`;
      textContent += `   Jawaban Asha  : "${item.aiResponse.replace(/\n/g, " ")}"\n`;
      textContent += "--------------------------------------------------------\n\n";
    });
    
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pertanyaan_belum_terjawab_smataq_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteUnanswered = (id: string) => {
    const updated = unansweredList.filter(item => item.id !== id);
    setUnansweredList(updated);
    localStorage.setItem("smataq_unanswered_questions", JSON.stringify(updated));
  };

  const handleClearAllUnanswered = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua daftar pertanyaan belum terjawab?")) {
      setUnansweredList([]);
      localStorage.setItem("smataq_unanswered_questions", "[]");
    }
  };

  const triggerUpdate = (updatedList: CustomKnowledgeItem[]) => {
    setKnowledgeList(updatedList);
    localStorage.setItem("smataq_custom_knowledge", JSON.stringify(updatedList));
    onUpdateKnowledge(updatedList);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "1234" || passcode.toLowerCase() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("smataq_admin_session", "true");
      setAuthError("");
      setPasscode("");
    } else {
      setAuthError("Kode PIN Admin salah! Coba '1234' atau hubungi developer.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("smataq_admin_session");
  };

  // Plain copy-paste text uploader
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setNotification({ status: "error", text: "Mohon isi Judul dan Konten informasi terlebih dahulu." });
      return;
    }

    const newItem: CustomKnowledgeItem = {
      id: "manual-" + Date.now(),
      title: title.trim(),
      content: content.trim(),
      sourceType: "text",
      timestamp: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      isActive: true
    };

    const newList = [newItem, ...knowledgeList];
    triggerUpdate(newList);
    
    // Clear fields
    setTitle("");
    setContent("");
    setNotification({ status: "success", text: `Informasi "${newItem.title}" berhasil dimasukkan ke basis data Asha.` });
    
    setTimeout(() => setNotification(null), 4000);
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (ext === "pdf") return <FileText size={18} className="text-red-500" />;
    if (["xlsx", "xls", "csv"].includes(ext)) return <FileSpreadsheet size={18} className="text-emerald-600" />;
    if (["docx", "doc"].includes(ext)) return <FileType size={18} className="text-blue-600" />;
    if (["png", "jpg", "jpeg", "webp"].includes(ext)) return <ImageIcon size={18} className="text-purple-600" />;
    return <FileCode size={18} className="text-amber-600" />;
  };

  // Multi-format file reader & AI OCR converter
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewContent("");
    setIsParsingFile(true);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    try {
      // 1. Text / CSV / Markdown files
      if (ext === "txt" || ext === "csv" || ext === "json" || ext === "md" || file.type === "text/plain") {
        setParsingStatus("Membaca berkas teks...");
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = (event.target?.result as string) || "";
          setPreviewContent(text);
          setIsParsingFile(false);
        };
        reader.readAsText(file);
        return;
      }

      // 2. Excel Spreadsheets (.xlsx, .xls)
      if (ext === "xlsx" || ext === "xls") {
        setParsingStatus("Mengekstrak tabel lembar kerja Excel...");
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        let combinedText = "";

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const csvData = XLSX.utils.sheet_to_csv(worksheet);
          if (csvData.trim()) {
            combinedText += `=== LEMBAR KERJA (SHEET): ${sheetName} ===\n${csvData}\n\n`;
          }
        });

        if (!combinedText.trim()) {
          setNotification({ status: "error", text: "Lembar kerja Excel kosong atau tidak terdeteksi teks." });
        } else {
          setPreviewContent(combinedText);
        }
        setIsParsingFile(false);
        return;
      }

      // 3. PDF, Word (.docx, .doc), Images (.png, .jpg, .jpeg, .webp) via AI OCR Server Endpoint
      setParsingStatus(`Mengonversi berkas ${file.name} menjadi teks terstruktur via AI OCR...`);

      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.split(",")[1] || res;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/parse-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          base64Data
        })
      });

      const data = await res.json();
      if (res.ok && data.extractedText) {
        setPreviewContent(data.extractedText);
        setNotification({ status: "success", text: `Berhasil mengonversi "${file.name}" menjadi teks informasi!` });
        setTimeout(() => setNotification(null), 3000);
      } else {
        throw new Error(data.error || "Gagal mengonversi file.");
      }
    } catch (err: any) {
      console.error("File processing error:", err);
      setNotification({ status: "error", text: `Gagal membaca berkas: ${err.message || "Pastikan format file valid."}` });
    } finally {
      setIsParsingFile(false);
    }
  };

  // Submit parsed file content to knowledge list
  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !previewContent.trim()) {
      setNotification({ status: "error", text: "Silakan pilih berkas yang ingin diunggah dan pastikan pratinjau teks sudah terisi." });
      return;
    }

    const cleanTitle = selectedFile.name.replace(/\.[^/.]+$/, ""); // strip extension

    const newItem: CustomKnowledgeItem = {
      id: "file-" + Date.now(),
      title: cleanTitle,
      content: previewContent.trim(),
      sourceType: "file",
      fileName: selectedFile.name,
      timestamp: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      isActive: true
    };

    const newList = [newItem, ...knowledgeList];
    triggerUpdate(newList);

    setSelectedFile(null);
    setPreviewContent("");
    setNotification({ status: "success", text: `Dokumen "${newItem.fileName}" berhasil diparsing & diintegrasikan.` });

    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dokumen data ini dari memori chatbot Asha?")) {
      const newList = knowledgeList.filter((item) => item.id !== id);
      triggerUpdate(newList);
    }
  };

  const handleToggleActive = (id: string) => {
    const newList = knowledgeList.map((item) => {
      if (item.id === id) {
        return { ...item, isActive: !item.isActive };
      }
      return item;
    });
    triggerUpdate(newList);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl h-[90vh] md:h-[80vh] flex flex-col overflow-hidden border border-slate-100"
      >
        {/* Header bar */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-800 rounded-xl flex items-center justify-center border border-emerald-700">
              <Settings size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Console Administrator & Basis Pengetahuan</h2>
              <p className="text-[10px] text-emerald-250 opacity-80">Enrich basis data jawaban Virtual Assistant Asha secara offline</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-emerald-800 rounded-lg transition-colors text-emerald-100 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* AUTHENTICATION VIEW */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/50">
            <div className="w-16 h-16 bg-amber-50 text-amber-700 flex items-center justify-center rounded-3xl border border-amber-200 mb-4 shadow-sm">
              <Lock size={24} className="animate-pulse" />
            </div>
            
            <div className="max-w-md text-center space-y-2 mb-6">
              <h3 className="text-sm font-bold text-slate-800">Verifikasi Hak Akses Admin SMATAQ</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Halaman ini dilindungi untuk administrator sekolah. Masukkan PIN Admin untuk menambah, menonaktifkan, atau menghapus materi acuan chatbot.
              </p>
              <p className="text-[10px] bg-slate-100 text-slate-500 inline-block px-2.5 py-1 rounded-md font-bold">
                💡 Petunjuk Akses: Masukkan kunci PIN <code className="text-brand-500 font-mono">1234</code> atau <code className="text-brand-500 font-mono">admin</code>
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="Masukkan PIN Admin..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full text-center text-xs bg-white border border-slate-200 focus:border-brand-500 outline-none p-3 rounded-xl transition-all font-semibold font-mono tracking-widest block placeholder:tracking-normal placeholder:font-sans"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 text-[10px] bg-red-50 text-red-600 border border-red-100 rounded-lg p-2.5 font-semibold">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                id="admin-login-submit"
                className="w-full py-3 bg-brand-500 hover:bg-brand-650 text-white font-bold rounded-xl text-xs transition-transform hover:scale-101 active:scale-99 cursor-pointer shadow-sm"
              >
                Konfirmasi Masuk
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMINISTRATOR WORKSPACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-slate-50/20">
            {/* LEFT HALF: Uploader / Text inserter */}
            <div className="w-full md:w-1/2 p-6 border-r border-slate-100 flex flex-col justify-between overflow-y-auto min-h-0">
              <div className="space-y-4">
                {/* Visual tabs switcher */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("add-manual")}
                    className={`flex-1 py-1.5 text-[10px] md:text-[11px] font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                      activeTab === "add-manual"
                        ? "bg-white text-brand-500 shadow-xs"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    📝 Input Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("add-file")}
                    className={`flex-1 py-1.5 text-[10px] md:text-[11px] font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                      activeTab === "add-file"
                        ? "bg-white text-brand-500 shadow-xs"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    📁 Upload Berkas (PDF, Excel, Word, Foto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("unanswered")}
                    className={`flex-1 py-1.5 text-[10px] md:text-[11px] font-bold rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer relative ${
                      activeTab === "unanswered"
                        ? "bg-white text-amber-600 shadow-xs border border-amber-100"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    📋 Masukan ({unansweredList.length})
                    {unansweredList.length > 0 && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Form Notification Messages */}
                {notification && (
                  <div className={`flex items-start gap-2 text-[11px] p-3 rounded-xl border ${
                    notification.status === "success" 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800 font-medium" 
                      : "bg-red-50 border-red-100 text-red-700 font-medium"
                  }`}>
                    {notification.status === "success" ? <CheckCheck size={14} className="mt-0.5" /> : <AlertCircle size={14} className="mt-0.5" />}
                    <span>{notification.text}</span>
                  </div>
                )}

                {activeTab === "add-manual" ? (
                  /* Manual input text content form */
                  <form onSubmit={handleAddManual} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Judul Rujukan Utama</label>
                      <input
                        type="text"
                        placeholder="Contoh: Rincian Biaya Seragam Resmi TA 2026/2027"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-xs border border-slate-200 focus:border-brand-500 bg-white p-2.5 rounded-xl outline-none transition-all font-semibold"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Isi Informasi Materi</label>
                        <span className="text-[9px] text-slate-400 font-semibold">{content.length} karakter</span>
                      </div>
                      <textarea
                        rows={7}
                        placeholder="Ketik atau tempelkan data di sini... (Contoh: Rincian biaya seragam putra adalah Rp1.500.000 mencakup 5 pasang seragam khusus...)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full text-xs border border-slate-200 focus:border-brand-500 bg-white p-3 rounded-xl outline-none transition-all font-medium leading-relaxed resize-none"
                      />
                    </div>

                    <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100 flex gap-2.5 items-start">
                      <Info size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-[10px] text-emerald-800 leading-normal font-medium">
                        <strong>Dukungan Upload Berkas:</strong> Anda sekarang bisa langsung mengunggah file <strong>PDF, Excel, Word, Foto/Gambar (Brosur/Tabel), CSV, atau TXT</strong> di tab <strong>"Upload Berkas"</strong> di atas. Sistem AI OCR akan otomatis membaca dan mengonversi berkas tersebut menjadi teks informasi!
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-101 active:scale-99 cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Simpan ke Memori Asha
                    </button>
                  </form>
                ) : activeTab === "add-file" ? (
                  /* Multi-Format Document Uploader Form */
                  <form onSubmit={handleAddFile} className="space-y-3.5">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:bg-slate-50/80 hover:border-brand-300 transition-all cursor-pointer relative bg-white">
                      <input
                        type="file"
                        accept=".txt,.pdf,.docx,.doc,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp"
                        onChange={handleFileChange}
                        disabled={isParsingFile}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-wait"
                      />
                      <Upload size={26} className="text-brand-500 mx-auto mb-2" />
                      <span className="block text-xs font-bold text-slate-800">Upload Berkas Sumber Informasi</span>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        Pilih atau seret berkas Anda ke sini (Mendukung semua format)
                      </span>
                      
                      {/* Format Badges */}
                      <div className="flex flex-wrap justify-center gap-1 mt-2.5">
                        <span className="text-[9px] font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100">PDF</span>
                        <span className="text-[9px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">Excel</span>
                        <span className="text-[9px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">Word</span>
                        <span className="text-[9px] font-semibold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md border border-purple-100">Gambar/Foto</span>
                        <span className="text-[9px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">TXT/CSV</span>
                      </div>
                    </div>

                    {/* Parsing Spinner */}
                    {isParsingFile && (
                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                        <Loader2 size={18} className="animate-spin text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-emerald-800">Mengekstrak Dokumen via AI OCR...</p>
                          <p className="text-[10px] text-emerald-600 font-medium">{parsingStatus}</p>
                        </div>
                      </div>
                    )}

                    {selectedFile && !isParsingFile && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {getFileIcon(selectedFile.name)}
                          <div>
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{selectedFile.name}</p>
                            <p className="text-[9px] text-slate-400 font-semibold">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewContent("");
                          }}
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {previewContent && !isParsingFile && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pratinjau Hasil Ekstraksi Teks</label>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Dapat Diedit</span>
                        </div>
                        <textarea
                          rows={6}
                          value={previewContent}
                          onChange={(e) => setPreviewContent(e.target.value)}
                          className="w-full bg-slate-900 text-emerald-300 font-mono text-[10px] p-3 rounded-xl leading-relaxed resize-y outline-none border border-slate-700 focus:border-emerald-500 transition-colors"
                          placeholder="Teks hasil konversi berkas akan muncul di sini..."
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!selectedFile || !previewContent.trim() || isParsingFile}
                      className="w-full py-2.5 bg-brand-500 hover:bg-brand-650 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm"
                    >
                      <Plus size={14} /> Simpan Hasil ke Memori Chatbot Asha
                    </button>
                  </form>
                ) : (
                  /* Unanswered questions management catalog */
                  <div className="space-y-4 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between gap-2 bg-slate-100/50 p-2.5 rounded-2xl border border-slate-200/60 shrink-0">
                      <div>
                        <h4 className="text-[11px] font-extrabold text-slate-700">Manajemen Masukan Pertanyaan</h4>
                        <p className="text-[9.5px] text-slate-500 font-medium">Total <strong>{unansweredList.length}</strong> pertanyaan belum tercover</p>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleDownloadUnanswered}
                          disabled={unansweredList.length === 0}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 text-white font-semibold text-[9.5px] py-1.5 px-2.5 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          📥 Unduh (.TXT)
                        </button>
                        
                        <button
                          type="button"
                          onClick={handleClearAllUnanswered}
                          disabled={unansweredList.length === 0}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 disabled:opacity-45 font-semibold text-[9.5px] py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ms-1"
                        >
                          <Trash2 size={11} /> Bersihkan
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[360px]">
                      {unansweredList.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-5">
                          <HelpCircle size={28} className="text-emerald-500 mb-2 animate-bounce" />
                          <p className="text-xs font-bold text-slate-700">Hebat! Semua Pertanyaan Terjawab</p>
                          <p className="text-[10px] text-slate-400 max-w-[240px] text-center mt-1 leading-relaxed">
                            Belum ada laporan pertanyaan kurang lengkap ataupun deteksi otomatis dari sistem chatbot Asha.
                          </p>
                        </div>
                      ) : (
                        unansweredList.map((item) => (
                          <div key={item.id} className="bg-white border border-slate-200 hover:border-slate-350 p-3 rounded-xl flex flex-col gap-2 relative transition-all group">
                            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${
                                  item.reportedBy === "auto" ? "bg-amber-100 text-amber-800" : "bg-teal-100 text-teal-800"
                                }`}>
                                  {item.reportedBy === "auto" ? "Scan Otomatis" : "Laporan User"}
                                </span>
                                <span className="text-[8.5px] text-slate-400 font-medium">{item.timestamp}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteUnanswered(item.id)}
                                className="text-slate-400 hover:text-red-500 rounded-lg p-0.5 hover:bg-red-50 transition-all cursor-pointer"
                                title="Abaikan Laporan"
                              >
                                <X size={11} />
                              </button>
                            </div>
                            
                            <div>
                              <p className="text-xs font-bold text-slate-800 leading-normal">
                                "{item.question}"
                              </p>
                              {item.aiResponse && (
                                <p className="text-[9.5px] text-slate-400 italic mt-1.5 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 font-sans">
                                  Respon Asha: "{item.aiResponse}"
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end gap-2.5 pt-1 border-t border-slate-50">
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.question);
                                  alert(`Berhasil disalin: "${item.question}"`);
                                }}
                                className="text-[9px] font-bold text-slate-400 hover:text-brand-600 transition-colors cursor-pointer flex items-center gap-0.5"
                              >
                                📋 Salin Teks
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setTitle(item.question);
                                  setActiveTab("add-manual");
                                }}
                                className="text-[9px] font-bold text-brand-500 hover:text-brand-700 transition-colors cursor-pointer flex items-center gap-0.5"
                              >
                                ➕ Jawab/Lengkapi Info
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Back to chat switch button */}
              <button
                onClick={handleLogout}
                className="mt-6 text-[10px] text-slate-400 hover:text-slate-600 block text-right font-semibold cursor-pointer border-t border-slate-100 pt-3 flex items-center justify-end gap-1"
              >
                <Unlock size={11} /> Keluar Sesi Administrator
              </button>
            </div>

            {/* RIGHT HALF: Registered Database List preview */}
            <div className="w-full md:w-1/2 p-6 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 text-slate-500 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Basis Data Terdaftar ({knowledgeList.length} Berkas)
                </span>
                <span className="text-[9px] font-semibold text-slate-400">Terbaca secara Instan</span>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0">
                {knowledgeList.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-6 flex flex-col items-center justify-center">
                    <FileCode size={32} className="text-slate-300 mb-2.5" />
                    <h4 className="text-xs font-bold text-slate-600">Belum ada basis data tambahan</h4>
                    <p className="text-[10.5px] text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                      Tambahkan rincian keuangan, kalender akademik baru, rincian biaya seragam, atau file asrama lainnya di form kiri agar Asha dapat menjawab secara otomatis berbasis data tersebut.
                    </p>
                  </div>
                ) : (
                  knowledgeList.map((item) => (
                    <div 
                      key={item.id}
                      className={`bg-white border rounded-2xl p-3.5 transition-all flex flex-col justify-between gap-3.5 ${
                        item.isActive ? "border-slate-200 hover:border-brand-200" : "border-slate-200 opacity-65 grayscale bg-slate-50/50"
                      }`}
                    >
                      {/* Top title area */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {item.sourceType === "file" ? (
                              <FileText size={15} className="text-slate-400" />
                            ) : (
                              <FileCode size={15} className="text-slate-400" />
                            )}
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                          </div>
                          <span className="text-[8.5px] font-semibold text-slate-400 shrink-0">{item.content.length} karakter</span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-sans">{item.content}</p>
                      </div>

                      {/* Controls footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 shrink-0">
                        <span className="text-[9px] text-slate-400 font-medium">Terdaftar: {item.timestamp}</span>
                        
                        <div className="flex items-center gap-2">
                          {/* Active / Idle Toggle switch style button */}
                          <button
                            onClick={() => handleToggleActive(item.id)}
                            className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                              item.isActive 
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" 
                                : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                            }`}
                          >
                            {item.isActive ? "● Aktif" : "○ Idle"}
                          </button>

                          {/* Delete document button */}
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Hapus rujukan"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
