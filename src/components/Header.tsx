import React from "react";
import { School, Layers, Phone, Send, Info, Award, HelpCircle } from "lucide-react";
import { PROFIL_DATA } from "../schoolData";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-100 py-3.5 px-6 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side: Brand Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/10 shrink-0">
            <School size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-sm font-extrabold text-slate-800 tracking-tight font-sans">
                SMA Takhassus Al-Qur'an Wonosobo
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Resmi • SMATAQ
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Jl. K.H. Asy'ari No.29, Kalibeber, Mojotengah, Wonosobo, Jawa Tengah
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action & Slogan Display */}
        <div className="flex items-center gap-2.5 sm:gap-4 md:self-center font-sans">
          <div className="hidden lg:block text-right">
            <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              Slogan Kami
            </span>
            <span className="block text-xs font-extrabold text-brand-500 italic">
              "{PROFIL_DATA.slogan}"
            </span>
          </div>
          
          <div className="h-6 w-px bg-slate-200 hidden lg:block" />

          {/* Quick contact trigger */}
          <div className="flex items-center gap-2">
            <a
              href="tel:02863326374"
              className="flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-500 px-3 py-1.5 rounded-xl text-xs font-bold border border-brand-100 transition-all cursor-pointer"
            >
              <Phone size={12} />
              <span className="hidden sm:inline">Hubungi Kontak Sekolah:</span> 0286-3326374
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
