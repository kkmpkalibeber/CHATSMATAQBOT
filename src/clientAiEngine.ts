import { FAQ_DATA, PROFIL_DATA, PPDB_DATA, FASILITAS_DATA, PRESTASI_DATA } from "./schoolData";
import { CustomKnowledgeItem } from "./types";

/**
 * Smart Client-Side Knowledge Engine
 * Used when running on static hosting (like GitHub Pages or static preview) where Express /api/chat backend is unavailable.
 */
export function generateClientResponse(
  userQuery: string,
  activeKnowledge: CustomKnowledgeItem[]
): { reply: string; isUnresolved: boolean } {
  const query = userQuery.toLowerCase().trim();
  const queryWords = query.split(/\s+/).filter(w => w.length > 2);

  // 1. First, search custom knowledge documents uploaded by Admin
  for (const item of activeKnowledge) {
    const titleMatch = item.title.toLowerCase();
    const contentMatch = item.content.toLowerCase();

    // Check direct keyword match in title or content
    if (queryWords.some(word => titleMatch.includes(word) || contentMatch.includes(word))) {
      // If query is strongly related to this custom document
      const score = queryWords.reduce((acc, word) => {
        if (titleMatch.includes(word)) return acc + 3;
        if (contentMatch.includes(word)) return acc + 1;
        return acc;
      }, 0);

      if (score >= 2 || query.includes("berkas") || query.includes("dokumen") || titleMatch.split(/\s+/).some(w => query.includes(w))) {
        return {
          reply: `**Informasi Berkas/Dokumen Resmi (${item.title}):**\n\n${item.content}\n\n*Jika Anda membutuhkan penjelasan teknis lebih lanjut, silakan hubungi kontak resmi sekolah di **${PROFIL_DATA.contacts.telp}**.*`,
          isUnresolved: false
        };
      }
    }
  }

  // 2. Direct Query Intent Recognition
  // Pendaftaran / PPDB / Cara Daftar
  if (query.includes("daftar") || query.includes("ppdb") || query.includes("spmb") || query.includes("syarat") || query.includes("registrasi")) {
    return {
      reply: `**Informasi Pendaftaran Siswa Baru (PPDB/SPMB) SMATAQ Wonosobo:**\n\n- **Sistem Pendaftaran:** ${PPDB_DATA.system}.\n- **Aturan Zonasi:** ${PPDB_DATA.zonation}\n- **Website Pendaftaran Online:** [http://ppdb.al-asyariyyah.com/](http://ppdb.al-asyariyyah.com/) atau [https://spmb.al-asyariyyah.com/](https://spmb.al-asyariyyah.com/)\n- **Program Beasiswa:**\n${PPDB_DATA.scholarships.map(s => `  • **${s.name}:** ${s.desc}`).join("\n")}\n\nAda yang ingin ditanyakan lagi terkait alur pendaftaran?`,
      isUnresolved: false
    };
  }

  // Alamat & Kontak
  if (query.includes("alamat") || query.includes("lokasi") || query.includes("kontak") || query.includes("telepon") || query.includes("telp") || query.includes("email") || query.includes("dimana")) {
    return {
      reply: `**Alamat & Kontak Resmi SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo:**\n\n- 📍 **Alamat:** ${PROFIL_DATA.address}\n- 📞 **Telepon/Fax:** ${PROFIL_DATA.contacts.telp}\n- ✉️ **Email:** ${PROFIL_DATA.contacts.email}\n- 🌐 **Website Resmi:** [${PROFIL_DATA.contacts.website}](${PROFIL_DATA.contacts.website})\n- 🏆 **Slogan:** *"${PROFIL_DATA.slogan}"*`,
      isUnresolved: false
    };
  }

  // Beasiswa
  if (query.includes("beasiswa") || query.includes("bantuan") || query.includes("gratis")) {
    return {
      reply: `**Program Beasiswa di SMATAQ Wonosobo:**\n\n${PPDB_DATA.scholarships.map(s => `• **${s.name}:** ${s.desc}`).join("\n")}\n\nUntuk pengajuan beasiswa, silakan isi formulir saat pendaftaran online di [http://ppdb.al-asyariyyah.com/](http://ppdb.al-asyariyyah.com/).`,
      isUnresolved: false
    };
  }

  // Fasilitas / Kelas / Lab / GOR
  if (query.includes("fasilitas") || query.includes("kelas") || query.includes("lab") || query.includes("gor") || query.includes("olahraga") || query.includes("masjid") || query.includes("taman")) {
    return {
      reply: `**Fasilitas Pembelajaran & Olahraga SMATAQ Wonosobo:**\n\n- **Ruang Kelas:** ${FASILITAS_DATA.classrooms} kelas kondusif.\n- **Laboratorium:**\n${FASILITAS_DATA.labs.map(l => `  • ${l.name}: ${l.total} unit`).join("\n")}\n- **Fasilitas Lingkungan:**\n${FASILITAS_DATA.environments.map(e => `  • ${e}`).join("\n")}\n- **Gedung Olahraga (GOR):** ${FASILITAS_DATA.gor}`,
      isUnresolved: false
    };
  }

  // Prestasi & Lulusan / Kuliah
  if (query.includes("prestasi") || query.includes("lulusan") || query.includes("kuliah") || query.includes("ptn") || query.includes("alumni")) {
    return {
      reply: `**Prestasi Siswa & Kelanjutan Studi Alumni SMATAQ Wonosobo:**\n\n- **Pencapaian Prestasi:** ${PRESTASI_DATA.achievements}\n- **Tujuan Kuliah Lulusan:** ${PRESTASI_DATA.outcomes}\n- **Jumlah Alumni:** Lebih dari **${PROFIL_DATA.alumniCount}** alumni sejak berdiri tahun ${PROFIL_DATA.established}.`,
      isUnresolved: false
    };
  }

  // Slogan / Profil / Keunggulan
  if (query.includes("slogan") || query.includes("keunggulan") || query.includes("profil") || query.includes("sejarah") || query.includes("tahfidz") || query.includes("bilingual") || query.includes("asrama") || query.includes("boarding")) {
    return {
      reply: `**Profil & Keunggulan Utama SMATAQ Wonosobo:**\n\n*Slogan: "${PROFIL_DATA.slogan}"*\n\n${PROFIL_DATA.advantages.map(a => `• **${a.title}:** ${a.desc}`).join("\n")}\n\nSekolah berdiri sejak tahun ${PROFIL_DATA.established} di bawah naungan Yayasan Al-Asy'ariyyah Kalibeber.`,
      isUnresolved: false
    };
  }

  // 3. Match against standard FAQ_DATA list using scoring
  let bestFaq: { question: string; answer: string; score: number } | null = null;

  for (const faq of FAQ_DATA) {
    const qLower = faq.question.toLowerCase();
    const aLower = faq.answer.toLowerCase();

    let score = 0;
    for (const word of queryWords) {
      if (qLower.includes(word)) score += 3;
      if (aLower.includes(word)) score += 1;
    }

    if (!bestFaq || score > bestFaq.score) {
      bestFaq = { question: faq.question, answer: faq.answer, score };
    }
  }

  if (bestFaq && bestFaq.score >= 2) {
    return {
      reply: `${bestFaq.answer}\n\n*Informasi ini berasal dari Basis Data Resmi SMATAQ.*`,
      isUnresolved: false
    };
  }

  // 4. Default Fallback response with official contact and auto-unresolved flag
  return {
    reply: `Afwan (mohon maaf), saya belum menemukan rincian spesifik mengenai pertanyaan Anda dalam basis data sekolah.\n\nSilakan hubungi Telepon Resmi kami di **${PROFIL_DATA.contacts.telp}** atau WhatsApp/Email **${PROFIL_DATA.contacts.email}** untuk informasi teknis terbaru. Pertanyaan Anda telah dicatat agar dikembangkan oleh tim administrator.`,
    isUnresolved: true
  };
}
