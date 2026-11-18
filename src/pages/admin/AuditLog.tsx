import { useState } from 'react';
import { ClipboardList, Filter } from 'lucide-react';

type AuditAction = 'Semua' | 'Tambah Layanan' | 'Edit Layanan' | 'Ubah Status Ajuan' | 'Login';

interface AuditEntry {
  id: string;
  waktu: string;
  admin: string;
  aksi: AuditAction;
  detail: string;
}

const mockAuditLog: AuditEntry[] = [
  { id: '1', waktu: '18 Nov 2026, 09:14', admin: 'admin@ruangpulih.id', aksi: 'Login', detail: 'Login berhasil dari 192.168.1.10' },
  { id: '2', waktu: '17 Nov 2026, 15:42', admin: 'admin@ruangpulih.id', aksi: 'Ubah Status Ajuan', detail: 'Ajuan RP-2026-0041 → Diproses' },
  { id: '3', waktu: '17 Nov 2026, 14:08', admin: 'admin@ruangpulih.id', aksi: 'Edit Layanan', detail: 'Edit "Bantuan Beasiswa" – pembaruan kontak unit' },
  { id: '4', waktu: '16 Nov 2026, 11:30', admin: 'admin@ruangpulih.id', aksi: 'Ubah Status Ajuan', detail: 'Ajuan RP-2026-0039 → Diterima' },
  { id: '5', waktu: '15 Nov 2026, 16:55', admin: 'pengelola2@ruangpulih.id', aksi: 'Tambah Layanan', detail: 'Tambah layanan "Aksesibilitas Kampus"' },
  { id: '6', waktu: '15 Nov 2026, 10:03', admin: 'admin@ruangpulih.id', aksi: 'Login', detail: 'Login berhasil dari 10.0.0.5' },
  { id: '7', waktu: '14 Nov 2026, 13:21', admin: 'pengelola2@ruangpulih.id', aksi: 'Edit Layanan', detail: 'Edit "Konsultasi Akademik" – pembaruan jadwal' },
  { id: '8', waktu: '13 Nov 2026, 09:47', admin: 'admin@ruangpulih.id', aksi: 'Ubah Status Ajuan', detail: 'Ajuan RP-2026-0030 → Selesai' },
  { id: '9', waktu: '12 Nov 2026, 14:15', admin: 'pengelola2@ruangpulih.id', aksi: 'Tambah Layanan', detail: 'Tambah layanan "Program Bantuan Pendidikan"' },
  { id: '10', waktu: '11 Nov 2026, 08:30', admin: 'admin@ruangpulih.id', aksi: 'Login', detail: 'Login berhasil dari 192.168.1.10' },
];

const ACTION_OPTIONS: AuditAction[] = ['Semua', 'Tambah Layanan', 'Edit Layanan', 'Ubah Status Ajuan', 'Login'];

export default function AuditLog() {
  const [filter, setFilter] = useState<AuditAction>('Semua');

  const filtered = filter === 'Semua' ? mockAuditLog : mockAuditLog.filter((e) => e.aksi === filter);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <ClipboardList size={24} style={{ color: '#1F5E47' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#181C1A' }}>Log Aktivitas</h1>
          </div>
          <p style={{ color: '#4B5550' }} className="text-sm">Riwayat seluruh aktivitas yang dilakukan oleh pengelola platform.</p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          <Filter size={16} style={{ color: '#4B5550' }} />
          <label className="text-sm font-medium" style={{ color: '#4B5550' }}>Filter Aksi:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as AuditAction)}
            className="text-sm rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-[#1F5E47]"
            style={{ borderColor: '#E5E9E6', color: '#181C1A', backgroundColor: '#fff' }}
          >
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#E5E9E6' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F9FAF8' }}>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Waktu</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Admin</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Aksi</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr
                  key={entry.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? '#fff' : '#FBFBF9',
                    borderTop: '1px solid #E5E9E6',
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-mono" style={{ color: '#4B5550' }}>{entry.waktu}</td>
                  <td className="px-6 py-4 text-xs" style={{ color: '#4B5550' }}>{entry.admin}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          entry.aksi === 'Login' ? '#EDF2F7' :
                          entry.aksi === 'Tambah Layanan' ? '#E9F3EE' :
                          entry.aksi === 'Edit Layanan' ? '#F5EFE6' :
                          '#FDF8EE',
                        color:
                          entry.aksi === 'Login' ? '#2C4A6E' :
                          entry.aksi === 'Tambah Layanan' ? '#1F5E47' :
                          entry.aksi === 'Edit Layanan' ? '#6E4E24' :
                          '#7A541C',
                      }}
                    >
                      {entry.aksi}
                    </span>
                  </td>
                  <td className="px-6 py-4" style={{ color: '#181C1A' }}>{entry.detail}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm" style={{ color: '#4B5550' }}>
                    Tidak ada entri untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
