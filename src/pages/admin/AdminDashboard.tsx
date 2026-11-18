import { Link } from 'react-router-dom';
import { LayoutDashboard, Settings, ClipboardList, Users, CheckCircle, Clock } from 'lucide-react';
import { INITIAL_SERVICES } from '../../types/database';
import StatusBadge from '../../components/StatusBadge';

const mockRequests = [
  { ref: 'RP-2026-0041', layanan: 'Bantuan Beasiswa', status: 'Diproses' as const, tanggal: '17 Nov 2026' },
  { ref: 'RP-2026-0039', layanan: 'Bantuan Dana Darurat', status: 'Diterima' as const, tanggal: '16 Nov 2026' },
  { ref: 'RP-2026-0036', layanan: 'Konseling Birokrasi', status: 'Selesai' as const, tanggal: '15 Nov 2026' },
  { ref: 'RP-2026-0033', layanan: 'Pendampingan Sosial', status: 'Diterima' as const, tanggal: '14 Nov 2026' },
  { ref: 'RP-2026-0030', layanan: 'Konsultasi Akademik', status: 'Selesai' as const, tanggal: '13 Nov 2026' },
];

export default function AdminDashboard() {
  const activeServices = INITIAL_SERVICES.filter((s) => s.isActive).length;
  const categories = [...new Set(INITIAL_SERVICES.map((s) => s.category))].length;

  const stats = [
    {
      label: 'Layanan Aktif',
      value: activeServices,
      icon: <CheckCircle size={20} className="text-[#1F5E47]" />,
      bg: '#E9F3EE',
    },
    {
      label: 'Kategori',
      value: categories,
      icon: <LayoutDashboard size={20} className="text-[#2C4A6E]" />,
      bg: '#EDF2F7',
    },
    {
      label: 'Ajuan Masuk Bulan Ini',
      value: 12,
      icon: <ClipboardList size={20} className="text-[#6E4E24]" />,
      bg: '#F5EFE6',
    },
    {
      label: 'Menunggu Verifikasi',
      value: 4,
      icon: <Clock size={20} className="text-[#7A541C]" />,
      bg: '#FDF8EE',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard size={24} style={{ color: '#1F5E47' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#181C1A' }}>Dasbor Pengelola</h1>
          </div>
          <p style={{ color: '#4B5550' }} className="text-sm">Selamat datang kembali, Admin. Berikut ringkasan aktivitas platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 border"
              style={{ backgroundColor: stat.bg, borderColor: '#E5E9E6' }}
            >
              <div className="flex items-center gap-2 mb-3">{stat.icon}</div>
              <p className="text-3xl font-bold" style={{ color: '#181C1A' }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: '#4B5550' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="flex gap-3 mb-8">
          <Link
            to="/admin/kelola"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#1F5E47', color: '#fff' }}
          >
            <Settings size={16} />
            Kelola Layanan
          </Link>
          <Link
            to="/admin/log"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-opacity hover:opacity-80"
            style={{ borderColor: '#E5E9E6', color: '#1F5E47', backgroundColor: '#fff' }}
          >
            <ClipboardList size={16} />
            Lihat Log Aktivitas
          </Link>
        </div>

        {/* Recent Requests */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#E5E9E6', backgroundColor: '#fff' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E9E6' }}>
            <div className="flex items-center gap-2">
              <Users size={18} style={{ color: '#1F5E47' }} />
              <h2 className="font-semibold text-sm" style={{ color: '#181C1A' }}>Ajuan Terbaru</h2>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F9FAF8' }}>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Nomor Ref</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Layanan</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Status</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {mockRequests.map((req, i) => (
                <tr
                  key={req.ref}
                  style={{ borderTop: i > 0 ? '1px solid #E5E9E6' : undefined }}
                >
                  <td className="px-6 py-4 font-mono text-xs" style={{ color: '#4B5550' }}>{req.ref}</td>
                  <td className="px-6 py-4 font-medium" style={{ color: '#181C1A' }}>{req.layanan}</td>
                  <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                  <td className="px-6 py-4" style={{ color: '#4B5550' }}>{req.tanggal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
