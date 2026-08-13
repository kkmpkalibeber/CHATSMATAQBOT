import { QuickTopic } from "./types";

export const PROFIL_DATA = {
  name: "SMA Takhassus Al-Qur'an (SMATAQ) Kalibeber, Wonosobo",
  established: 1989,
  alumniCount: "10.000+",
  slogan: "Berprestasi dan Istiqomah Ngaji? SMATAQ Aja!",
  advantages: [
    {
      title: "Integrasi Kurikulum",
      desc: "Memadukan prestasi akademik kedinasan dengan program keagamaan yang kuat."
    },
    {
      title: "Tahfidz Al-Qur'an",
      desc: "Program unggulan menghafal Al-Qur'an secara terstandar di asrama."
    },
    {
      title: "Program Bilingual",
      desc: "Komunikasi aktif menggunakan bahasa Arab dan bahasa Inggris sehari-hari."
    },
    {
      title: "Boarding School",
      desc: "Sistem asrama/pesantren terpadu di bawah naungan Yayasan Al-Asy'ariyyah."
    }
  ],
  address: "Jl. K.H. Asy'ari No.29, Kalibeber, Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351",
  contacts: {
    telp: "0286-3326374",
    email: "smataqwsb@gmail.com",
    website: "https://smataqwsb.sch.id"
  }
};

export const PPDB_DATA = {
  system: "Sistem Penerimaan Murid Baru (SPMB) di bawah Yayasan Al-Asy'ariyyah",
  zonation: "Bebas Zonasi - Menerima calon siswa dari daerah mana saja di seluruh Indonesia tanpa batasan wilayah.",
  scholarships: [
    { name: "Beasiswa Tahfidz", desc: "Dukungan bagi siswa berbakat penghafal Al-Qur'an." },
    { name: "Beasiswa Prestasi", desc: "Apresiasi bagi calon murid berprestasi akademik & non-akademik." },
    { name: "Beasiswa Kurang Mampu", desc: "Bantuan khusus bagi keluarga yang secara ekonomi membutuhkan." }
  ],
  links: {
    primary: "http://ppdb.al-asyariyyah.com/",
    portal: "https://spmb.al-asyariyyah.com/"
  }
};

export const FASILITAS_DATA = {
  classrooms: 36,
  labs: [
    { name: "Laboratorium Komputer", total: 4 },
    { name: "Laboratorium Biologi", total: 1 },
    { name: "Laboratorium Fisika", total: 1 },
    { name: "Laboratorium Kimia", total: 1 }
  ],
  environments: [
    "Masjid Sekolah (Pusat Ibadah & Kegiatan Tahfidz)",
    "1 Lapangan Upacara",
    "1 Taman Pembelajaran",
    "3 Taman Penghijauan"
  ],
  gor: "Gedung Olahraga (GOR) luas yang mendukung penuh untuk kegiatan Futsal, Voli, Takraw, Bulutangkis, Lompat Jauh, Basket, dan olahraga lainnya."
};

export const PRESTASI_DATA = {
  achievements: "Siswa-siswi SMATAQ aktif menorehkan ratusan juara dari tingkat Kabupaten, Provinsi, Nasional, hingga Internasional (seperti juara di ajang bergengsi FLS3N).",
  outcomes: "Lulusan sukses menembus berbagai Perguruan Tinggi Negeri (PTN) ternama di Indonesia melalui berbagai jalur seleksi nasional seperti SNBP (Prestasi), UTBK-SNBT (Tes Tertulis), hingga jalur keagamaan melalui PTKIN."
};

export const QUICK_TOPICS: QuickTopic[] = [
  {
    id: "profile_1",
    label: "✨ Slogan & Keunggulan",
    prompt: "Apa slogan dan keunggulan utama dari SMATAQ Wonosobo?",
    category: "profile"
  },
  {
    id: "profile_2",
    label: "📍 Alamat & Kontak",
    prompt: "Di mana alamat SMATAQ dan berapa nomor telepon resminya?",
    category: "profile"
  },
  {
    id: "ppdb_1",
    label: "📝 Cara Daftar PPDB",
    prompt: "Bagaimana cara melakukan pendaftaran siswa baru secara online di SMATAQ?",
    category: "ppdb"
  },
  {
    id: "ppdb_2",
    label: "🌍 Apakah Ada Zonasi?",
    prompt: "Apakah pendaftaran SMATAQ menggunakan jalur zonasi?",
    category: "ppdb"
  },
  {
    id: "ppdb_3",
    label: "🎓 Info Beasiswa",
    prompt: "Program beasiswa apa saja yang tersedia di SMATAQ?",
    category: "ppdb"
  },
  {
    id: "fac_1",
    label: "🏫 Jumlah Kelas & Lab",
    prompt: "Berapa banyak kelas dan laboratorium yang ada di SMATAQ?",
    category: "facilities"
  },
  {
    id: "fac_2",
    label: "⚽ Fasilitas Olahraga GOR",
    prompt: "Fasilitas olahraga apa saja yang tersedia di GOR SMATAQ?",
    category: "facilities"
  },
  {
    id: "ach_1",
    label: "🏆 Prestasi & Lulusan",
    prompt: "Bagaimana prestasi siswa SMATAQ dan ke mana biasanya lulusannya melanjutkan kuliah?",
    category: "achievements"
  },
  {
    id: "invalid_fee",
    label: "👕 Biaya Seragam & Seragam Sekolah",
    prompt: "Berapa rincian biaya seragam sekolah SMATAQ tahun ini?",
    category: "ppdb"
  }
];

export const FAQ_DATA = [
  // 1. Profil Sekolah
  {
    question: "Di mana alamat dan lokasi SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo?",
    answer: "SMATAQ berlokasi lengkap di Jl. K.H. Asy'ari No.29, Kalibeber, Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351. Sekolah ini sangat strategis dan berada di lingkungan agamis serta asri.",
    category: "Profil Sekolah"
  },
  {
    question: "Kapan SMATAQ didirikan dan bagaimana perkembangannya?",
    answer: "SMATAQ didirikan sejak tahun 1989. Selama perkembangannya, sekolah ini telah meluluskan lebih dari 10.000 alumni sukses yang berkiprah di berbagai sektor nasional maupun internasional.",
    category: "Profil Sekolah"
  },
  {
    question: "Bagaimana cara menghubungi kontak resmi sekolah untuk pertanyaan teknis?",
    answer: "Anda dapat menghubungi pihak sekolah melalui Telepon/Fax resmi di nomor 0286-3326374, via email di smataqwsb@gmail.com, atau dengan mengunjungi website resmi kami di https://smataqwsb.sch.id.",
    category: "Profil Sekolah"
  },
  
  // 2. Keunggulan
  {
    question: "Apa slogan resmi SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo?",
    answer: "Slogan resmi kebanggaan kami adalah \"Berprestasi dan Istiqomah Ngaji? SMATAQ Aja!\". Slogan ini menggambarkan komitmen tinggi dalam menyeimbangkan pencapaian duniawi (akademik) dan ukurawi (keagamaan).",
    category: "Keunggulan"
  },
  {
    question: "Apa saja keunggulan utama bersekolah di SMATAQ Wonosobo?",
    answer: "Keunggulan utama sekolah kami meliputi: 1) Memadukan prestasi akademik kurikulum nasional dengan program keagamaan yang kuat; 2) Program Tahfidz Al-Qur'an terpadu; 3) Program Bilingual (Arab-Inggris); serta 4) Sistem Boarding School (Asrama/Pesantren) di bawah Yayasan Al-Asy'ariyyah.",
    category: "Keunggulan"
  },
  {
    question: "Bagaimana integrasi prestasi kurikulum akademik dengan program keagamaan di SMATAQ?",
    answer: "SMATAQ merancang kurikulum terintegrasi di mana siswa dibekali kompetensi sains dan sosial yang tinggi serta program pendalaman agama intensif seperti hafalan Al-Qur'an (Tahfidz) dalam keseimbangan yang harmonis.",
    category: "Keunggulan"
  },

  // 3. PPDB
  {
    question: "Bagaimana jalur pendaftaran Penerimaan Peserta Didik Baru (PPDB) di SMATAQ?",
    answer: "Pendaftaran siswa baru menggunakan Sistem Penerimaan Murid Baru (SPMB) di bawah Yayasan Al-Asy'ariyyah. Seluruh proses pendaftaran dilakukan secara online demi kenyamanan calon pendaftar.",
    category: "PPDB"
  },
  {
    question: "Di mana alamat link pendaftaran online resmi PPDB SMATAQ?",
    answer: "Pendaftaran online secara resmi dapat diakses melalui portal http://ppdb.al-asyariyyah.com/ atau melalui portal yayasan di https://spmb.al-asyariyyah.com/.",
    category: "PPDB"
  },
  {
    question: "Apakah PPDB di SMATAQ Wonosobo memberlakukan sistem zonasi?",
    answer: "Sama sekali tidak! SMATAQ memberlakukan aturan Bebas Zonasi. Kita menerima calon siswa dari daerah, kota, kabupaten, maupun provinsi mana saja di seluruh Indonesia tanpa pembatasan wilayah.",
    category: "PPDB"
  },
  {
    question: "Program beasiswa apa saja yang disediakan bagi calon siswa baru?",
    answer: "Kami menawarkan 3 program beasiswa utama: 1) Beasiswa Tahfidz Al-Qur'an; 2) Beasiswa Prestasi akademik & non-akademik; serta 3) Beasiswa Afirmasi untuk keluarga yang kurang mampu.",
    category: "PPDB"
  },
  {
    question: "Berapa rincian biaya pendaftaran, uang pangkal, atau seragam sekolah tahun ini?",
    answer: "Untuk pertanyaan rincian keuangan teknis seperti biaya pendaftaran lengkap ter-update dan biaya seragam tahun ini, silakan hubungi Kontak Resmi Telefon Yayasan/Sekolah di nomor 0286-3326374 agar mendapatkan informasi valid.",
    category: "PPDB"
  },

  // 4. Program Unggulan
  {
    question: "Bagaimana pelaksanaan Program Tahfidz Al-Qur'an di SMATAQ?",
    answer: "Program Tahfidz Al-Qur'an dilaksanakan secara berkelanjutan dengan bimbingan ustadz/ustadzah berpengalaman di lingkungan pesantren/asrama guna memastikan kualitas dan kelancaran hafalan santri.",
    category: "Program Unggulan"
  },
  {
    question: "Bagaimana penerapan Program Bilingual di lingkungan sekolah?",
    answer: "Program Bilingual membiasakan para siswa untuk menerapkan komunikasi aktif menggunakan Bahasa Arab dan Bahasa Inggris dalam percakapan sehari-hari di area sekolah maupun asrama.",
    category: "Program Unggulan"
  },
  {
    question: "Bagaimana sistem Boarding School (Asrama/Pesantren) di SMATAQ?",
    answer: "Seluruh siswa berada di asrama/pesantren terpadu di bawah naungan Yayasan Al-Asy'ariyyah. Pembinaan karakter, ibadah, keamanan, dan kebersihan dipantau 24 jam dengan penuh kekeluargaan.",
    category: "Program Unggulan"
  },

  // 5. Ekstrakurikuler & Fasilitas
  {
    question: "Berapa jumlah ruang kelas dan laboratorium yang tersedia untuk pembelajaran?",
    answer: "SMATAQ dilengkapi dengan 36 kelas pembelajaran yang kondusif. Selain itu, terdapat 7 laboratorium pendukung: 4 laboratorium komputer, 1 laboratorium biologi, 1 laboratorium fisika, dan 1 laboratorium kimia.",
    category: "Ekstrakurikuler & Fasilitas"
  },
  {
    question: "Apa saja fasilitas ibadah dan area hijau penunjang di SMATAQ?",
    answer: "Kami menyediakan Masjid Sekolah untuk ibadah & kegiatan keagamaan, 1 Lapangan Upacara, 1 Taman Pembelajaran, serta 3 Taman Penghijauan untuk mendukung suasana belajar yang nyaman dan asri.",
    category: "Ekstrakurikuler & Fasilitas"
  },
  {
    question: "Fasilitas olahraga apa saja yang tersedia di Gedung Olahraga (GOR) SMATAQ?",
    answer: "SMATAQ memiliki Gedung Olahraga (GOR) yang sangat luas dan memadai. Fasilitas ini mendukung penuh kegiatan olahraga seperti Futsal, Voli, Takraw, Bulutangkis, Lompat Jauh, Basket, dan aktivitas olahraga lainnya.",
    category: "Ekstrakurikuler & Fasilitas"
  },
  {
    question: "Apa saja prestasi dan ke mana tujuan akhir kuliah lulusan SMATAQ?",
    answer: "Siswa-siswi kami aktif mengukir ratusan prestasi di tingkat Kabupaten, Provinsi, Nasional, hingga Internasional (seperti ajang FLS3N). Lulusan kami sukses diterima di berbagai PTN ternama (melalui jalur SNBP, UTBK-SNBT) serta PTKIN ternama.",
    category: "Ekstrakurikuler & Fasilitas"
  },
  
  // 6. Tambahan Informasi Resmi dari Web Sekolah (smataqwsb.sch.id)
  {
    question: "Apa Visi dan Misi dari SMA Takhassus Al-Qur'an (SMATAQ) Wonosobo?",
    answer: "Visi SMATAQ: \"Terwujudnya generasi yang unggul dalam prestasi, anggun dalam akhlak, serta istiqomah dalam mengaji dan menghafal Al-Qur'an\". Misi kami meliputi: 1) Menyelenggarakan pendidikan akademik bermutu tinggi; 2) Membina hafalan Qur'an yang mutqin; 3) Menerapkan pembiasaan akhlakul karimah di asrama; serta 4) Meningkatkan penguasaan IPTEK dan bahasa global (Arab & Inggris).",
    category: "Profil Sekolah"
  },
  {
    question: "Siapa tokoh pendiri utama dan sejarah hubungan SMATAQ dengan Pondok Pesantren Al-Asy'ariyyah?",
    answer: "SMATAQ dirintis atas prakarsa ulama kharismatik legendaris Wonosobo, KH. Muntaha Al-Hafidz (Mbah Mun), pengasuh pondok pesantren Al-Asy'ariyyah Kalibeber. Didirikan pada tahun 1989, sekolah ini menjadi pelopor sekolah umum tingkat menengah atas pertama yang mewajibkan seluruh siswanya untuk mondok dan menghafal Al-Qur'an di Jawa Tengah.",
    category: "Profil Sekolah"
  },
  {
    question: "Apa saja kegiatan keagamaan dan kitab kuning yang dikaji oleh siswa SMATAQ?",
    answer: "Selain Tahfidz Al-Qur'an, seluruh siswa mempelajari dasar hukum Islam dan moral melalui kajian Kitab Kuning dasar (seperti Mabadi Fiqhiyyah, Fathul Qorib, Aqidatul Awam, dan Ta'limul Muta'allim), Mujahadah rutin, Shalat dhuha dan jamaah lima waktu tertib, serta ziarah dan pembiasaan tahlil yasin.",
    category: "Program Unggulan"
  },
  {
    question: "Ke manakah tren kelanjutan studi alumni SMATAQ yang ingin ke luar negeri?",
    answer: "Selain sukses menembus PTN dan PTKIN favorit nasional (seperti UIN, UNDIP, UNNES, dll), banyak alumni SMATAQ yang berhasil melanjutkan studi hukum Islam atau kedokteran ke Universitas Al-Azhar di Kairo (Mesir), universitas di Yaman, Tunisia, Turki, hingga ke benua Eropa melalui program beasiswa khusus pesantren.",
    category: "Program Unggulan"
  }
];
