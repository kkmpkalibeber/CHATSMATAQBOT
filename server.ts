import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PROFIL_DATA, PPDB_DATA, FASILITAS_DATA, PRESTASI_DATA, FAQ_DATA } from "./src/schoolData";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route for chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, customKnowledge } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is missing on the server. Please check Settings > Secrets." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Format messages into Content objects for @google/genai
      const contents = messages.map(msg => {
        return {
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        };
      });

      // Format rich datasets into a structured textual knowledge base for LLM injection
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

      const baseSystemInstruction = `Anda adalah "Asha", asisten virtual bertenaga Kecerdasan Artifisial (Artificial Intelligence) resmi dari SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo. Tugas utama Anda adalah memberikan informasi cerdas, mengalir secara natural seperti percakapan manusia, ramah, dan solutif seputar sekolah.

PANDUAN KOMUNIKASI & PENANGANAN DATA DOKUMEN/TABEL (CRITICAL CAPABILITY):
1. PENGOLAHAN DATA DOKUMEN & TABEL (EXCEL, WORD, PDF, GURU, TU, DLL):
   - Jika pada DATABASE PENGETAHUAN TAMBAHAN terdapat berkas tabel, daftar nama, atau file Excel/CSV/PDF (seperti daftar nama Guru, staf TU, siswa, fasilitas, atau jadwal):
   - Bila pengguna menanyakan JUMLAH (contoh: "berapa jumlah guru?", "berapa staf TU?", "berapa total fasilitas?"), hitunglah baris/item data tersebut secara cermat dan akurat berdasarkan keterangan/peran masing-masing (misal memisahkan mana yang Guru dan mana yang Staf TU).
   - Berikan jawaban berupa total angka pasti, serta sebutkan beberapa nama atau rincian jika relevan.
2. JAWABAN RINGKAS & TEPAT SASARAN: Ambillah HANYA informasi yang relevan dan jawablah secukupnya saja sesuai apa yang ditanyakan.
   - Contoh: Jika ditanya "kapan tahun berdirinya?", jawablah singkat: "SMA Takhassus Al-Qur'an didirikan pada tahun 1989."
   - Jika ditanya "berapa jumlah guru?", hitung dari data tambahan lalu jawab: "Berdasarkan data resmi sekolah, terdapat [X] orang guru..."
3. ALUR PERCAKAPAN NATURAL & SAPAAN PESANTREN: Awali interaksi dengan salam hangat Islami (misalnya: "Assalamualaikum Wr. Wb...").
4. PENANGANAN PERTANYAAN KHUSUS / TIDAK ADA DATA: Hanya gunakan kalimat "informasi belum tersedia" apabila topik yang ditanyakan BENAR-BENAR TIDAK TERSEDIA di basis data resmi maupun di DATABASE PENGETAHUAN TAMBAHAN. Jika data guru/TU ada di database tambahan, gunakan data tersebut sepenuhnya!

Gunakan basis data sekolah berikut untuk menyusun jawaban yang ringkas dan tepat sasaran:

${comprehensiveSchoolData}`;

      let customInstructionsText = "";
      if (customKnowledge && Array.isArray(customKnowledge) && customKnowledge.length > 0) {
        customInstructionsText = "\n\n=== DATABASE PENGETAHUAN TAMBAHAN (DITAMBAHKAN OLEH ADMIN SEKOLAH) ===\n";
        customKnowledge.forEach((item, index) => {
          customInstructionsText += `\nDokumen [${index + 1}]: "${item.title}"\nIsi Konten Dokumen:\n${item.content}\n`;
        });
        customInstructionsText += "\n============================================\nPetunjuk Penting: Gunakan seluruh isi dokumen tambahan di atas untuk menjawab pertanyaan spesifik pengguna (seperti daftar nama guru, staf TU, jumlah pengajar, jadwal, atau rincian file upload). Analisis dan hitung item di dalamnya secara teliti!";
      }

      const systemInstruction = baseSystemInstruction + customInstructionsText;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.35, // Balanced creativity and factual accuracy
        }
      });

      const reply = response.text || "Mohon maaf, saya mengalami kendala teknis. Silakan coba kembali.";
      return res.json({ reply });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({ error: error.message || "Something went wrong on the server." });
    }
  });

  // API Route for multi-format document and image conversion via AI OCR
  app.post("/api/parse-file", async (req, res) => {
    try {
      const { fileName, mimeType, base64Data } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: "Data berkas tidak ditemukan." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key belum terkonfigurasi di server." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let geminiMimeType = mimeType || "application/pdf";
      const ext = (fileName || "").toLowerCase();
      if (ext.endsWith(".pdf")) geminiMimeType = "application/pdf";
      else if (ext.endsWith(".png")) geminiMimeType = "image/png";
      else if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) geminiMimeType = "image/jpeg";
      else if (ext.endsWith(".webp")) geminiMimeType = "image/webp";
      else if (ext.endsWith(".txt") || ext.endsWith(".md")) geminiMimeType = "text/plain";
      else if (ext.endsWith(".csv")) geminiMimeType = "text/csv";
      else if (ext.endsWith(".docx") || ext.endsWith(".doc")) geminiMimeType = "application/pdf";

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

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });

      const extractedText = response.text || "";
      return res.json({ extractedText });
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
