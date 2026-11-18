# RuangPulih — Direktori Layanan & Pelacakan Bantuan Mahasiswa

**RuangPulih** adalah aplikasi web responsif yang berfungsi memusatkan informasi layanan dukungan mahasiswa (akademik, finansial, dan bantuan sosial) serta mempermudah pelacakan alur pengajuan bantuan secara transparan di lingkungan **UIN Sunan Gunung Djati Bandung**.

> **Catatan Batasan Proyek:**
> - RuangPulih murni bertindak sebagai **media informasi dan alur birokrasi pengajuan bantuan** (perantara informasi ke unit layanan resmi kampus).
> - Aplikasi ini **bukan** penyalur dana langsung, **bukan** layanan diagnosis psikologis otomatis, dan **bukan** layanan tanggap darurat (*emergency*).
> - Sistem menerapkan prinsip **minimalisasi data**: pengguna dilarang memasukkan riwayat medis atau detail informasi kesehatan mental ke dalam formulir.

---

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Backend & Database (Tahap Integrasi):** Supabase (PostgreSQL + Auth + Row Level Security)

---

## Struktur Folder Proyek

```text
ruang-pulih/
├── public/                 # Aset statis publik
├── src/
│   ├── components/         # Komponen UI reusable
│   │   ├── HelpModal.tsx       # Modal panduan & peringatan privasi data
│   │   ├── Navbar.tsx          # Header navigasi utama
│   │   ├── ProtectedRoute.tsx  # Proteksi halaman khusus Admin
│   │   ├── ServiceCard.tsx     # Kartu tampilan item layanan di direktori
│   │   └── StatusBadge.tsx     # Badge label status pengajuan
│   ├── lib/
│   │   └── supabase.ts         # Konfigurasi koneksi client Supabase
│   ├── pages/              # Halaman utama aplikasi
│   │   ├── admin/              # Halaman khusus Dashboard Pengelola/Admin
│   │   │   ├── AdminDashboard.tsx  # Statistik & daftar ajuan masuk
│   │   │   ├── AuditLog.tsx        # Catatan riwayat aktivitas admin
│   │   │   └── ManageServices.tsx  # Tambah & edit informasi layanan
│   │   ├── AccessDenied.tsx    # Halaman peringatan akses terbatas (non-admin)
│   │   ├── Home.tsx            # Beranda, pencarian & filter direktori layanan
│   │   ├── Login.tsx           # Halaman masuk, daftar demo & simulasi akses
│   │   ├── RequestForm.tsx     # Formulir pengajuan bantuan minimal
│   │   ├── RequestSuccess.tsx  # Konfirmasi nomor referensi (RP-2026-XXX)
│   │   ├── ServiceDetail.tsx   # Detail layanan, alur resmi & dokumen prasyarat
│   │   └── TrackStatus.tsx     # Pelacakan status progres ajuan
│   ├── types/
│   │   └── database.ts         # Definisi tipe TypeScript & data awal layanan
│   ├── App.tsx             # Pengaturan rute halaman (React Router)
│   ├── index.css           # Konfigurasi Tailwind CSS & style global
│   └── main.tsx            # Entry point aplikasi
├── .env                    # Variabel environment lokal (jangan di-commit)
├── .gitignore              # Daftar file yang diabaikan Git
├── package.json            # Daftar dependensi proyek
└── vite.config.ts          # Konfigurasi Vite & Tailwind plugin