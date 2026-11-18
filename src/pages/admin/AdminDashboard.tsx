import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  ClipboardList,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { INITIAL_SERVICES } from '../../types/database';
import StatusBadge from '../../components/StatusBadge';

type RequestStatus = 'Diterima' | 'Diproses' | 'Selesai';

interface RequestRecord {
  id: string;
  reference_number: string;
  service_title: string;
  applicant_name: string;
  applicant_nim: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS: RequestStatus[] = [
  'Diterima',
  'Diproses',
  'Selesai',
];

function normalizeStatus(rawStatus: string): RequestStatus {
  const s = (rawStatus || '').toLowerCase();
  if (s === 'diproses' || s === 'in_review' || s === 'in review') return 'Diproses';
  if (s === 'selesai' || s === 'completed') return 'Selesai';
  return 'Diterima';
}

function formatTanggal(iso: string): string {
  if (!iso) return '-';
  const date = new Date(iso);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [activeServicesCount, setActiveServicesCount] = useState(
    INITIAL_SERVICES.filter((s) => s.isActive).length
  );
  const [categoriesCount, setCategoriesCount] = useState(
    [...new Set(INITIAL_SERVICES.map((s) => s.category))].length
  );
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    // 1. Ambil daftar permohonan terbaru dari Supabase
    const { data: reqData, error: reqError } = await supabase
      .from('requests')
      .select(
        'id, reference_number, service_title, applicant_name, applicant_nim, status, created_at'
      )
      .order('created_at', { ascending: false });

    if (!reqError && reqData) {
      setRequests(reqData);
    }

    // 2. Ambil statistik layanan aktif dari Supabase (fallback ke INITIAL_SERVICES jika kosong)
    const { data: svcData, error: svcError } = await supabase
      .from('services')
      .select('category, is_active');

    if (!svcError && svcData && svcData.length > 0) {
      const aktif = svcData.filter((s) => s.is_active);
      setActiveServicesCount(aktif.length);
      setCategoriesCount([...new Set(svcData.map((s) => s.category))].length);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusChange = async (
    req: RequestRecord,
    newStatus: RequestStatus
  ) => {
    setUpdatingId(req.id);

    const { error } = await supabase
      .from('requests')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.id);

    if (!error) {
      // Perbarui state lokal langsung
      setRequests((prev) =>
        prev.map((item) =>
          item.id === req.id ? { ...item, status: newStatus } : item
        )
      );

      // Catat ke audit_logs
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert([
        {
          admin_email: user?.email || 'demo-admin@ruangpulih',
          action: `Mengubah status ajuan menjadi "${newStatus}"`,
          target_object: req.reference_number,
        },
      ]);
    }

    setUpdatingId(null);
  };

  // Hitung jumlah ajuan bulan ini & menunggu verifikasi secara dinamis
  const now = new Date();
  const monthlyRequestsCount = requests.filter((r) => {
    const d = new Date(r.created_at);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  const pendingVerificationCount = requests.filter(
    (r) => normalizeStatus(r.status) === 'Diterima'
  ).length;

  const stats = [
    {
      label: 'Layanan Aktif',
      value: activeServicesCount,
      icon: <CheckCircle size={20} className="text-[#1F5E47]" />,
      bg: '#E9F3EE',
    },
    {
      label: 'Kategori',
      value: categoriesCount,
      icon: <LayoutDashboard size={20} className="text-[#2C4A6E]" />,
      bg: '#EDF2F7',
    },
    {
      label: 'Ajuan Masuk Bulan Ini',
      value: monthlyRequestsCount,
      icon: <ClipboardList size={20} className="text-[#6E4E24]" />,
      bg: '#F5EFE6',
    },
    {
      label: 'Menunggu Verifikasi',
      value: pendingVerificationCount,
      icon: <Clock size={20} className="text-[#7A541C]" />,
      bg: '#FDF8EE',
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <LayoutDashboard size={24} style={{ color: '#1F5E47' }} />
            <h1 className="text-2xl font-bold" style={{ color: '#181C1A' }}>
              Dasbor Pengelola
            </h1>
          </div>
          <p style={{ color: '#4B5550' }} className="text-sm">
            Selamat datang kembali, Admin. Berikut ringkasan aktivitas platform.
          </p>
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
              <p className="text-3xl font-bold" style={{ color: '#181C1A' }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: '#4B5550' }}>
                {stat.label}
              </p>
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
            style={{
              borderColor: '#E5E9E6',
              color: '#1F5E47',
              backgroundColor: '#fff',
            }}
          >
            <ClipboardList size={16} />
            Lihat Log Aktivitas
          </Link>
        </div>

        {/* Recent Requests */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: '#E5E9E6', backgroundColor: '#fff' }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: '#E5E9E6' }}
          >
            <div className="flex items-center gap-2">
              <Users size={18} style={{ color: '#1F5E47' }} />
              <h2 className="font-semibold text-sm" style={{ color: '#181C1A' }}>
                Ajuan Terbaru
              </h2>
            </div>
            <span className="text-xs" style={{ color: '#4B5550' }}>
              Total: {requests.length} ajuan
            </span>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-[#4B5550]">
              Memuat data permohonan dari database...
            </div>
          ) : requests.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#4B5550]">
              Belum ada permohonan yang masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: '#F9FAF8' }}>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Nomor Ref
                    </th>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Pemohon
                    </th>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Layanan
                    </th>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Status
                    </th>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Tanggal
                    </th>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Ubah Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, i) => {
                    const currentStatus = normalizeStatus(req.status);
                    return (
                      <tr
                        key={req.id}
                        style={{
                          borderTop: i > 0 ? '1px solid #E5E9E6' : undefined,
                        }}
                      >
                        <td
                          className="px-6 py-4 font-mono text-xs font-semibold"
                          style={{ color: '#1F5E47' }}
                        >
                          {req.reference_number}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="font-medium"
                            style={{ color: '#181C1A' }}
                          >
                            {req.applicant_name}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: '#4B5550' }}
                          >
                            NIM: {req.applicant_nim}
                          </div>
                        </td>
                        <td
                          className="px-6 py-4 font-medium"
                          style={{ color: '#181C1A' }}
                        >
                          {req.service_title}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={currentStatus} />
                        </td>
                        <td
                          className="px-6 py-4 whitespace-nowrap"
                          style={{ color: '#4B5550' }}
                        >
                          {formatTanggal(req.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={currentStatus}
                            disabled={updatingId === req.id}
                            onChange={(e) =>
                              handleStatusChange(
                                req,
                                e.target.value as RequestStatus
                              )
                            }
                            className="rounded-lg border border-[#D4DDD8] bg-[#F9FAF8] px-2.5 py-1.5 text-xs font-medium text-[#181C1A] outline-none focus:border-[#1F5E47] disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}