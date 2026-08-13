export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface QuickTopic {
  id: string;
  label: string;
  prompt: string;
  category: "all" | "profile" | "ppdb" | "facilities" | "achievements" | "faq";
}

export interface FAQItem {
  question: string;
  answer: string;
  category: "Profil Sekolah" | "Keunggulan" | "PPDB" | "Program Unggulan" | "Ekstrakurikuler & Fasilitas";
}

export interface CustomKnowledgeItem {
  id: string;
  title: string;
  content: string;
  sourceType: "text" | "file";
  fileName?: string;
  timestamp: string;
  isActive: boolean;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  aiResponse: string;
  timestamp: string;
  status: "pending" | "resolved";
  reportedBy: "auto" | "user";
}

