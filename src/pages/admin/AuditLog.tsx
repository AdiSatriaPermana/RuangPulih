import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Filter } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  admin_email: string;
  action: string;
  target_object: string;
  created_at: string;
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState('Semua');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gagal memuat audit log:', error);
      } else {
        setLogs(data || []);
      }
      setLoading(false);
    }

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (selectedAction === 'Semua') return true;
    return log.action.toLowerCase() === selectedAction.toLowerCase();
  });

  function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#181C1A]">Log Aktivitas</h1>
        <p className="mt-1 text-sm text-[#4B5550]">
          Riwayat seluruh aktivitas yang dilakukan oleh pengelola platform.
        </p>
      </div>

      {/* Filter Aksi */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#4B5550]">
          <Filter size={16} />
          <span>Filter Aksi:</span>
        </div>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="rounded-xl border border-[#E5E9E6] bg-white px-3 py-2 text-sm text-[#181C1A] outline-none focus:border-[#1F5E47]"
        >
          <option value="Semua">Semua</option>
          <option value="Ubah Status Ajuan">Ubah Status Ajuan</option>
          <option value="Edit Layanan">Edit Layanan</option>
          <option value="Tambah Layanan">Tambah Layanan</option>
          <option value="Login">Login</option>
        </select>
      </div>

      {/* Tabel Log */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E9E6] bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E9E6] bg-[#F9FAF8] text-xs font-semibold uppercase tracking-wider text-[#4B5550]">
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Admin</th>
              <th className="px-6 py-4">Aksi</th>
              <th className="px-6 py-4">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E9E6] text-sm text-[#181C1A]">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#4B5550]">
                  Memuat log aktivitas...
                </td>
              </tr>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FBFBF9] transition-colors">
                  <td className="px-6 py-4 text-xs text-[#4B5550]">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#181C1A]">
                    {log.admin_email}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-lg bg-[#E9F3EE] px-2.5 py-1 text-xs font-semibold text-[#1F5E47]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#4B5550]">
                    {log.target_object}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#4B5550]">
                  Belum ada catatan aktivitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}