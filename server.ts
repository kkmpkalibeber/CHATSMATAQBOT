import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PROFIL_DATA, PPDB_DATA, FASILITAS_DATA, PRESTASI_DATA, FAQ_DATA } from "./src/schoolData";

dotenv.config();

// Local smart knowledge base fallback if AI model rate limits or fails
function generateFallbackReply(userQuery: string, customKnowledge: any[], comprehensiveSchoolData: string): string {
  const queryLower = (userQuery || "").toLowerCase();
  
  // 1. First, search in active custom knowledge documents uploaded by admin
  const activeCustom = Array.isArray(customKnowledge) ? customKnowledge.filter(k => k && k.isActive !== false) : [];
  
  const matchedCustom = activeCustom.filter(doc => {
    const titleMatch = (doc.title || "").toLowerCase().includes(queryLower);
    const contentMatch = (doc.content || "").toLowerCase().includes(queryLower);
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
    const keywordMatch = keywords.some(kw => 
      (doc.title || "").toLowerCase().includes(kw) || (doc.content || "").toLowerCase().includes(kw)
    );
    return titleMatch || contentMatch || keywordMatch;
  });

  if (matchedCustom.length > 0) {
    let replyText = "Assalamualaikum Wr. Wb.\n\nBerdasarkan berkas dokumen resmi terdaftar, berikut rincian informasinya:\n\n";
    matchedCustom.forEach((doc) => {
      replyText += `📌 **${doc.title}**:\n${doc.content}\n\n`;
    });
    return replyText;
  }

  // 2. Keyword matches on built-in school data
  if (queryLower.includes("prestasi") || queryLower.includes("juara") || queryLower.includes("lomba") || queryLower.includes("alumni")) {
    return `Assalamualaikum Wr. Wb.\n\nBerikut rincian **Prestasi & Luaran Lulusan SMATAQ Wonosobo**:\n- **Prestasi Siswa**: ${PRESTASI_DATA.achievements}\n- **Prospek Lulusan**: ${PRESTASI_DATA.outcomes}`;
  }
  if (queryLower.includes("fasilitas") || queryLower.includes("gedung") || queryLower.includes("lab") || queryLower.includes("gor") || queryLower.includes("kelas")) {
    return `Assalamualaikum Wr. Wb.\n\nFasilitas unggulan SMATAQ Wonosobo meliputi:\n- **Ruang Kelas**: ${FASILITAS_DATA.classrooms} ruang kelas representatif\n- **Laboratorium**: ${FASILITAS_DATA.labs.map((l: any) => `${l.name} (${l.total} unit)`).join(", ")}\n- **Fasilitas Ibadah & Asrama**: ${FASILITAS_DATA.environments.join(", ")}\n- **GOR**: ${FASILITAS_DATA.gor}`;
  }
  if (queryLower.includes("ppdb") || queryLower.includes("daftar") || queryLower.includes("syarat") || queryLower.includes("beasiswa") || queryLower.includes("biaya")) {
    return `Assalamualaikum Wr. Wb.\n\nInformasi Pendaftaran (PPDB) SMATAQ Wonosobo:\n- **Sistem**: ${PPDB_DATA.system}\n- **Jalur Zonasi**: ${PPDB_DATA.zonation}\n- **Link Pendaftaran**: ${PPDB_DATA.links.primary}\n- **Program Beasiswa**: ${PPDB_DATA.scholarships.map((s: any) => `${s.name} (${s.desc})`).join("; ")}`;
  }
  if (queryLower.includes("profil") || queryLower.includes("sejarah") || queryLower.includes("alamat") || queryLower.includes("kontak") || queryLower.includes("berdiri")) {
    return `Assalamualaikum Wr. Wb.\n\n**Profil SMATAQ Wonosobo**:\n- **Nama**: ${PROFIL_DATA.name}\n- **Didirikan**: Tahun ${PROFIL_DATA.established}\n- **Slogan**: "${PROFIL_DATA.slogan}"\n- **Alamat**: ${PROFIL_DATA.address}\n- **Kontak**: ${PROFIL_DATA.contacts.telp} | ${PROFIL_DATA.contacts.email}`;
  }

  // 3. If user has active custom knowledge, show list of available documents
  if (activeCustom.length > 0) {
    let replyText = "Assalamualaikum Wr. Wb.\n\nBerikut ringkasan dokumen resmi yang saat ini terdaftar di basis data sekolah:\n\n";
    activeCustom.forEach(doc => {
      replyText += `📄 **${doc.title}**:\n${doc.content.slice(0, 400)}${doc.content.length > 400 ? "..." : ""}\n\n`;
    });
    return replyText;
  }

  return "Assalamualaikum Wr. Wb.\n\nAfwan, informasi tersebut belum tercantum di basis data saat ini. Anda dapat menambahkan berkas atau catatan informasi baru di panel **Kelola Chatbot (Admin)** agar saya dapat menjawabnya secara lengkap.";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route for chat
  app.post("/api/chat", async (req, res) => {
    const { messages, customKnowledge } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";

    // Build comprehensive school dataset
    const comprehensiveSchoolData = `
=========================================
BASIS DATA PENGETAHUAN RESMI SEKOLAH (SMATAQ)
=========================================

1. PROFIL UTAMA SEKOLAH:
- Nama Lengkap: ${PROFIL_DATA.name}
- Didirikan Sejak: Tahun ${PROFIL_DATA.established} (Mempunyai lebih dari ${PROFIL_DATA.alumniCount} alumni sukses)
- Slogan Resmi: "${PROFIL_DATA.slogan}"
- Keunggulan Utama:
${PROFIL_DATA.advantages.map((adv: any) => `  * ${adv.title}: ${adv.desc}`).join("\n")}
- Alamat Lengkap: ${PROFIL_DATA.address}
- Kontak Hubungan Resmi: Telepon/Fax (${PROFIL_DATA.contacts.telp}), Email (${PROFIL_DATA.contacts.email}), Website Resmi (${PROFIL_DATA.contacts.website})

2. SISTEM DAN JALUR PENDAFTARAN (PPDB / SPMB):
- Sistem PPDB: ${PPDB_DATA.system}
- Jalur Zonasi: ${PPDB_DATA.zonation} (Aturan Bebas Zonasi)
- Link Pendaftaran Resmi Online: ${PPDB_DATA.links.primary} atau melalui portal utama yayasan di ${PPDB_DATA.links.portal}
- Program Beasiswa Unggulan:
${PPDB_DATA.scholarships.map((sch: any) => `  * ${sch.name}: ${sch.desc}`).join("\n")}

3. SARANA PRASARANA & FASILITAS:
- Ruang Kelas Terpadu: ${FASILITAS_DATA.classrooms} ruang kelas representatif dan kondusif
- Ruang Laboratorium Lengkap:
${FASILITAS_DATA.labs.map((lab: any) => `  * ${lab.name}: sebanyak ${lab.total} unit`).join("\n")}
- Lingkungan & Fasilitas Ibadah:
${FASILITAS_DATA.environments.map((env: any) => `  * ${env}`).join("\n")}
- Gedung Olahraga Terpadu (GOR): ${FASILITAS_DATA.gor}

4. PRESTASI & LUARAN KELANJUTAN STUDI:
- Prestasi Siswa: ${PRESTASI_DATA.achievements}
- Masa Depan Lulusan: ${PRESTASI_DATA.outcomes}

5. KATALOG TANYA JAWAB (FAQ) POPULER (Gunakan Sebagai Rujukan Utama):
${FAQ_DATA.map((faq: any, idx: number) => `INFORMASI FAQ #${idx+1}:
- Pertanyaan Umum: ${faq.question}
- Jawaban Resmi: ${faq.answer}`).join("\n\n")}
`;

    let customInstructionsText = "";
    if (customKnowledge && Array.isArray(customKnowledge) && customKnowledge.length > 0) {
      const activeKnowledge = customKnowledge.filter(item => item && item.isActive !== false);
      if (activeKnowledge.length > 0) {
        customInstructionsText = "\n\n=== [PRIORITAS UTAMA] DATABASE PENGETAHUAN TAMBAHAN DARI DOKUMEN/BERKAS ADMIN ===\n";
        activeKnowledge.forEach((item, index) => {
          customInstructionsText += `\nDokumen [${index + 1}]: "${item.title}"\nIsi Konten Dokumen:\n${item.content}\n`;
        });
        customInstructionsText += "\n============================================\nPETUNJUK SANGAT PENTING: Gunakan SELURUH isi dokumen tambahan di atas sebagai prioritas utama jawaban Anda! Jika pengguna menanyakan daftar prestasi, nama guru, staf, fasilitas, atau rincian dari dokumen tambahan, uraikan secara lengkap dan rinci!";
      }
    }

    const systemInstruction = `Anda adalah "Asha", asisten virtual resmi dari SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo. Tugas Anda adalah memberikan informasi yang ramah, sopan, Islami, serta akurat seputar sekolah.

PANDUAN KOMUNIKASI & PENANGANAN DATA:
1. UTAMAKAN DATABASE PENGETAHUAN TAMBAHAN: Apabila informasi yang ditanyakan pengguna (seperti daftar prestasi, nama guru, staf TU, fasilitas, atau dokumen) ada di DATABASE PENGETAHUAN TAMBAHAN, bacalah dengan cermat dan sampaikan seluruh jawabannya secara lengkap.
2. JAWABAN JELAS & TEPAT SASARAN: Jawablah pertanyaan pengguna dengan bahasa Indonesia yang santun dan berstruktur rapi.
3. ALUR NATURAL & SALAM: Awali dengan salam Islami hangat (misalnya: "Assalamualaikum Wr. Wb...").
4. JIKA DATA TIDAK ADA: Apabila topik yang ditanyakan benar-benar tidak tercantum baik di basis data resmi maupun dokumen tambahan, katakan dengan sopan bahwa informasi tersebut belum tercantum di basis data.

Basis data sekolah:
${comprehensiveSchoolData}
${customInstructionsText}`;

    const apiKey = process.env.GEMINI_API_KEY;

    // Try Gemini models sequentially
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const contents = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

      const MODELS_TO_TRY = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

      for (const modelName of MODELS_TO_TRY) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.35,
            }
          });

          if (response.text) {
            return res.json({ reply: response.text });
          }
        } catch (err: any) {
          console.warn(`Gemini Model (${modelName}) warning/error:`, err?.message || err);
          // If rate limit or error, continue to next model or fallback
        }
      }
    }

    // Fallback: If API Key missing, rate limited (429), or error across all models
    console.warn("Using smart local knowledge search fallback for query:", lastUserMessage);
    const fallbackReply = generateFallbackReply(lastUserMessage, customKnowledge, comprehensiveSchoolData);
    return res.json({ reply: fallbackReply });
  });

  // API Route for multi-format document and image conversion via AI OCR
  app.post("/api/parse-file", async (req, res) => {
    try {
      const { fileName, mimeType, base64Data } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: "Data berkas tidak ditemukan." });
      }

      const ext = (fileName || "").toLowerCase();

      // 1. Direct text files (txt, csv, md, json, xml, html) -> Decode UTF-8 locally
      if (
        ext.endsWith(".txt") || 
        ext.endsWith(".csv") || 
        ext.endsWith(".md") || 
        ext.endsWith(".json") || 
        ext.endsWith(".xml") ||
        ext.endsWith(".html") ||
        (mimeType && mimeType.includes("text"))
      ) {
        try {
          const textContent = Buffer.from(base64Data, "base64").toString("utf-8");
          return res.json({ extractedText: textContent });
        } catch (e) {
          console.error("Text decoding error:", e);
        }
      }

      // 2. Word documents (.docx, .doc) -> Extract plain text from base64
      if (ext.endsWith(".docx") || ext.endsWith(".doc")) {
        try {
          const decodedRaw = Buffer.from(base64Data, "base64").toString("utf-8");
          // Extract readable ASCII strings from docx xml stream
          const cleanText = decodedRaw.replace(/<[^>]+>/g, " ").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
          if (cleanText.length > 50) {
            return res.json({ 
              extractedText: `=== HASIL EKSTRAKSI TEKS DOKUMEN WORD [${fileName}] ===\n\n${cleanText}` 
            });
          }
        } catch (e) {
          console.error("Docx text extraction error:", e);
        }
      }

      // 3. PDF and Images -> Use Gemini OCR API
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key belum terkonfigurasi di server." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      let geminiMimeType = "application/pdf";
      if (ext.endsWith(".png")) geminiMimeType = "image/png";
      else if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) geminiMimeType = "image/jpeg";
      else if (ext.endsWith(".webp")) geminiMimeType = "image/webp";

      const promptText = `Anda adalah sistem AI ekstraktor dokumen sekolah. Silakan baca berkas "${fileName}" ini secara seksama dan ekstrak SELURUH teks, tabel, data angka, jadwal, daftar syarat/alumni, dan poin penting di dalamnya.
Sajikan hasilnya dalam Bahasa Indonesia yang terstruktur, rapi, lengkap, dan mudah dibaca tanpa ada informasi penting yang terlewat, sehingga siap disimpan ke dalam basis pengetahuan AI chatbot sekolah.`;

      const contents = [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: geminiMimeType,
                data: base64Data
              }
            },
            { text: promptText }
          ]
        }
      ];

      const OCR_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
      for (const modelName of OCR_MODELS) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
          });

          if (response.text) {
            return res.json({ extractedText: response.text });
          }
        } catch (err: any) {
          console.warn(`OCR Model (${modelName}) warning:`, err?.message || err);
        }
      }

      return res.status(400).json({ 
        error: "Gagal mengekstrak teks otomatis dari berkas PDF/Gambar ini. Mohon pastikan dokumen memiliki halaman berisikan teks atau salin-tempel teks secara langsung." 
      });
    } catch (error: any) {
      console.error("Gemini File Parse Error:", error);
      return res.status(500).json({ error: "Gagal mengekstrak dokumen: " + (error?.message || "Terjadi kesalahan pada server.") });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

