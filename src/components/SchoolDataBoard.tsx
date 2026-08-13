import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  BookOpen, 
  School, 
  GraduationCap, 
  MessageSquare, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  ChevronDown
} from "lucide-react";
import { PROFIL_DATA, PPDB_DATA, FASILITAS_DATA, PRESTASI_DATA, FAQ_DATA } from "../schoolData";

interface SchoolDataBoardProps {
  onAskQuestion: (prompt: string) => void;
}

type TabType = "profile" | "ppdb" | "facilities" | "achievements" | "faq";

export default function SchoolDataBoard({ onAskQuestion }: SchoolDataBoardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [faqCategory, setFaqCategory] = useState<string>("Semua Kategori");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState<string>("");

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-full">
      {/* Decorative Top Banner */}
      <div className="bg-brand-500 text-white p-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10">
          <School size={160} />
        </div>
        <div className="relative z-10">
          <span className="bg-emerald-600/50 text-[10px] font-semibold text-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Slogan Resmi
          </span>
          <h2 className="text-xl font-bold mt-2 font-sans tracking-tight">
            "{PROFIL_DATA.slogan}"
          </h2>
          <p className="text-emerald-150 text-xs mt-1 opacity-90">
            SMA Takhassus Al-Qur'an Wonosobo • Sejak 1989
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto scrollbar-none">
        {(
          [
            { id: "profile", label: "Profil", icon: Building2 },
            { id: "ppdb", label: "PPDB", icon: GraduationCap },
            { id: "facilities", label: "Fasilitas", icon: School },
            { id: "achievements", label: "Prestasi", icon: Award },
            { id: "faq", label: "Tanya Jawab (FAQ)", icon: HelpCircle }
          ] as const
        ).map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-brand-500 text-brand-500 bg-white opacity-100"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
              }`}
            >
              <IconComponent size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6 flex-1 overflow-y-auto bg-slate-50/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-5"
          >
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-emerald-600" />
                      Profil Utama
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>SMA Takhassus Al-Qur'an (SMATAQ)</strong> adalah sekolah tingkat menengah atas di Kalibeber, Wonosobo yang didirikan sejak tahun <strong>1989</strong> dan telah meluluskan lebih dari <strong>10.000 alumni</strong> berprestasi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PROFIL_DATA.advantages.map((adv, index) => (
                      <motion.div 
                        variants={itemVariants}
                        key={index} 
                        className="bg-white p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors group cursor-pointer"
                        onClick={() => onAskQuestion(`Apa yang dimaksud dengan program ${adv.title} di SMATAQ?`)}
                      >
                        <h4 className="text-xs font-bold text-brand-500 flex items-center justify-between">
                          <span>{adv.title}</span>
                          <ChevronRight size={12} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {adv.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <MapPin size={14} className="text-red-500" />
                      Informasi Kontak & Alamat
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {PROFIL_DATA.address}
                    </p>
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <a 
                        href="tel:02863326374" 
                        className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-brand-500 transition-all font-medium"
                      >
                        <Phone size={12} className="text-brand-500" />
                        0286-3326374
                      </a>
                      <a 
                        href="mailto:smataqwsb@gmail.com" 
                        className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-brand-500 transition-all font-medium overflow-hidden text-ellipsis whitespace-nowrap"
                      >
                        <Mail size={12} className="text-brand-500" />
                        smataqwsb@gmail.com
                      </a>
                      <a 
                        href="https://smataqwsb.sch.id" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-brand-500 transition-all font-medium"
                      >
                        <Globe size={12} className="text-brand-500" />
                        smataqwsb.sch.id <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  id="ask-profile-btn"
                  onClick={() => onAskQuestion("Terangkan profil singkat, sejarah berdirinya, alamat lengkap, dan keunggulan utama dari SMATAQ Kalibeber Wonosobo!")}
                  className="w-full mt-2 bg-brand-50 hover:bg-brand-100 text-brand-500 border border-brand-200 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare size={14} />
                  Tanyakan Profil Lengkap ke Asha
                </button>
              </>
            )}

            {/* PPDB TAB */}
            {activeTab === "ppdb" && (
              <>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                    <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      Bebas Zonasi
                    </span>
                    <h3 className="text-sm font-bold text-slate-800">
                      Sistem SPMB Al-Asy'ariyyah
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Penerimaan Peserta Didik Baru (PPDB) SMATAQ diselenggarakan secara online terintegrasi melalui portal Yayasan Al-Asy'ariyyah. SMATAQ menganut kebijakan <strong>Bebas Zonasi</strong> yang memperbolehkan pendaftaran dari daerah mana saja tanpa hambatan jangkauan wilayah.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <Award size={14} className="text-amber-500" />
                      Beasiswa yang Tersedia
                    </h3>
                    <div className="space-y-2.5">
                      {PPDB_DATA.scholarships.map((sch, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-700">{sch.name}</h4>
                            <p className="text-[11px] text-slate-500">{sch.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-dashed border-slate-200">
                    <h4 className="text-xs font-bold text-slate-700 mb-2">Portal Pendaftaran Resmi</h4>
                    <div className="flex flex-col gap-2">
                      <a 
                        href="http://ppdb.al-asyariyyah.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-brand-500 hover:bg-brand-50 font-medium transition-all"
                      >
                        <span>ppdb.al-asyariyyah.com</span>
                        <ExternalLink size={12} />
                      </a>
                      <a 
                        href="https://spmb.al-asyariyyah.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-brand-500 hover:bg-brand-50 font-medium transition-all"
                      >
                        <span>spmb.al-asyariyyah.com</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    id="ask-ppdb-beasiswa-btn"
                    onClick={() => onAskQuestion("Apa saja program beasiswa yang ditawarkan di SMATAQ untuk murid baru?")}
                    className="bg-brand-50 hover:bg-brand-100 text-brand-500 border border-brand-200 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <BookOpen size={13} />
                    Info Beasiswa
                  </button>
                  <button
                    id="ask-ppdb-link-btn"
                    onClick={() => onAskQuestion("Bagaimana jalur pendaftaran, info zonasi, dan link resmi untuk daftar online ke SMATAQ?")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center"
                  >
                    <MessageSquare size={13} />
                    Cara Pendaftaran
                  </button>
                </div>
              </>
            )}

            {/* FACILITIES TAB */}
            {activeTab === "facilities" && (
              <>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <School size={14} className="text-indigo-500" />
                      Infrastruktur Pembelajaran
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                        <span className="block text-xl font-extrabold text-brand-500">{FASILITAS_DATA.classrooms}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Kelas Aktif</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                        <span className="block text-xl font-extrabold text-indigo-500">7</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Laboratorium</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-150 space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Laboratorium Lengkap:</h4>
                      <ul className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
                        {FASILITAS_DATA.labs.map((lab, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-brand-500 rounded-full" />
                            {lab.name} ({lab.total})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                    <h3 className="text-sm font-bold text-slate-800">Fasilitas Spiritual & Penghijauan</h3>
                    <div className="space-y-2">
                      {FASILITAS_DATA.environments.map((env, i) => (
                        <div key={i} className="flex gap-2 items-center text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full flex-shrink-0" />
                          <span>{env}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-1.5">Gedung Olahraga (GOR) Luas</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {FASILITAS_DATA.gor}
                    </p>
                  </div>
                </div>

                <button
                  id="ask-fac-btn"
                  onClick={() => onAskQuestion("Fasilitas apa saja yang dimiliki oleh SMATAQ? Terangkan rincian kelas, laboratorium, masjid, lingkungan hijau, serta GOR olahraga!")}
                  className="w-full mt-2 bg-brand-50 hover:bg-brand-100 text-brand-500 border border-brand-200 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare size={14} />
                  Tanyakan Detail Fasilitas ke Asha
                </button>
              </>
            )}

            {/* ACHIEVEMENTS TAB */}
            {activeTab === "achievements" && (
              <>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Award size={14} className="text-amber-500" />
                      Ratusan Juara Prestisius
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {PRESTASI_DATA.achievements}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md">
                        🔥 Berprestasi di Ajang FLS3N
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                    <h3 className="text-sm font-bold text-slate-800">
                      Output Kelulusan Unggul & Sukses
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {PRESTASI_DATA.outcomes}
                    </p>
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                      <div className="p-1.5 bg-brand-50 rounded-lg">
                        <span className="block text-xs font-bold text-brand-500">SNBP</span>
                        <span className="text-[9px] text-slate-400">Jalur Prestasi</span>
                      </div>
                      <div className="p-1.5 bg-amber-50/55 rounded-lg">
                        <span className="block text-xs font-bold text-amber-700">UTBK-SNBT</span>
                        <span className="text-[9px] text-slate-400">Seleksi Tes</span>
                      </div>
                      <div className="p-1.5 bg-emerald-50 rounded-lg">
                        <span className="block text-xs font-bold text-emerald-700">PTKIN</span>
                        <span className="text-[9px] text-slate-400">Kemenag</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  id="ask-achievements-btn"
                  onClick={() => onAskQuestion("Bagaimana info prestasi sekolah dan statistik kelulusan siswa SMA Takhassus Al-Qur'an (SMATAQ)?")}
                  className="w-full mt-2 bg-brand-50 hover:bg-brand-100 text-brand-500 border border-brand-200 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare size={14} />
                  Tanyakan Prestasi & Alumni ke Asha
                </button>
              </>
            )}

            {/* FAQ TAB */}
            {activeTab === "faq" && (
              <>
                {/* Search box & Categorization Filter */}
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Cari pertanyaan FAQ..."
                      value={faqSearch}
                      onChange={(e) => {
                        setFaqSearch(e.target.value);
                        setExpandedFaq(null);
                      }}
                      className="w-full text-xs bg-white border border-slate-200 focus:border-brand-500 rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all font-medium text-slate-700 shadow-xs"
                    />
                  </div>

                  {/* Category badgified scrollable bar */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 snap-x">
                    {[
                      "Semua Kategori",
                      "Profil Sekolah",
                      "Keunggulan",
                      "PPDB",
                      "Program Unggulan",
                      "Ekstrakurikuler & Fasilitas"
                    ].map((cat) => {
                      const isCatActive = faqCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setFaqCategory(cat);
                            setExpandedFaq(null);
                          }}
                          className={`snap-center px-3 py-1.5 text-[10px] font-bold rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                            isCatActive
                              ? "bg-brand-500 border-brand-500 text-white shadow-xs"
                              : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FAQ List Accordions */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {(() => {
                    const filtered = FAQ_DATA.filter((item) => {
                      const matchesSearch = item.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
                                           item.answer.toLowerCase().includes(faqSearch.toLowerCase());
                      const matchesCategory = faqCategory === "Semua Kategori" || item.category === faqCategory;
                      return matchesSearch && matchesCategory;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200 p-4">
                          <HelpCircle size={24} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-bold text-slate-500">Pertanyaan tidak ditemukan</p>
                          <p className="text-[10px] text-slate-400 mt-1">Coba gunakan kata kunci lainnya atau filter kategori yang berbeda.</p>
                        </div>
                      );
                    }

                    return filtered.map((item, index) => {
                      const isExpanded = expandedFaq === index;
                      return (
                        <div 
                          key={index} 
                          id={`faq-item-${index}`}
                          className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-xs transition-shadow"
                        >
                          {/* Accordion Trigger Header */}
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : index)}
                            className="w-full text-left p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-brand-50 text-brand-500">
                                {item.category}
                              </span>
                              <h4 className="text-xs font-bold text-slate-800 leading-snug">
                                {item.question}
                              </h4>
                            </div>
                            <span className="self-center flex-shrink-0 text-slate-400">
                              {isExpanded ? <ChevronDown size={14} className="text-brand-500" /> : <ChevronRight size={14} />}
                            </span>
                          </button>

                          {/* Accordion Content Body */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-3.5 bg-slate-50/55 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-3">
                                  <p>{item.answer}</p>
                                  <div className="pt-2 flex justify-end">
                                    <button
                                      onClick={() => onAskQuestion(item.question)}
                                      className="inline-flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-500 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-brand-200 transition-colors cursor-pointer"
                                    >
                                      <MessageSquare size={11} />
                                      Tanyakan ke Asha di Chat
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    });
                  })()}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
