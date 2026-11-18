import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Plus, Pencil, Trash2, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  mapRowToServiceItem,
  type ServiceCategory,
  type ServiceItem,
} from '../../types/database';

const categoryBadge: Record<ServiceCategory, { bg: string; color: string }> = {
  Finansial: { bg: '#E9F3EE', color: '#1F5E47' },
  Akademik: { bg: '#EDF2F7', color: '#2C4A6E' },
  'Bantuan Sosial': { bg: '#F5EFE6', color: '#6E4E24' },
};

const CATEGORIES: ServiceCategory[] = ['Finansial', 'Akademik', 'Bantuan Sosial'];

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function ManageServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Finansial' as ServiceCategory,
    summary: '',
    officialStepsText: '',
    prerequisitesText: '',
    unitName: '',
    contactEmail: '',
    contactPhone: '',
    source: 'Direktorat Kemahasiswaan',
    verifiedAt: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    isActive: true,
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setServices(data.map(mapRowToServiceItem));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const recordAuditLog = async (action: string, targetObject: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert([
      {
        admin_email: user?.email || 'admin@ruangpulih.id',
        action,
        target_object: targetObject,
      },
    ]);
  };

  const openAddModal = () => {
    setEditingService(null);
    setFormError('');
    setFormData({
      title: '',
      category: 'Finansial',
      summary: '',
      officialStepsText: '',
      prerequisitesText: '',
      unitName: '',
      contactEmail: '',
      contactPhone: '',
      source: 'Direktorat Kemahasiswaan',
      verifiedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormError('');
    setFormData({
      title: service.title,
      category: service.category,
      summary: service.summary,
      officialStepsText: (service.officialSteps || []).join('\n'),
      prerequisitesText: (service.prerequisites || []).join('\n'),
      unitName: service.unitName,
      contactEmail: service.contactEmail,
      contactPhone: service.contactPhone,
      source: service.source,
      verifiedAt: service.verifiedAt,
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim() || !formData.summary.trim() || !formData.unitName.trim()) {
      setFormError('Judul, ringkasan, dan nama unit wajib diisi.');
      return;
    }

    setSaving(true);

    const officialSteps = formData.officialStepsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const prerequisites = formData.prerequisitesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      slug: editingService ? editingService.slug : createSlug(formData.title),
      category: formData.category,
      summary: formData.summary.trim(),
      official_steps: officialSteps,
      prerequisites: prerequisites,
      unit_name: formData.unitName.trim(),
      contact_email: formData.contactEmail.trim() || '-',
      contact_phone: formData.contactPhone.trim() || '-',
      source: formData.source.trim() || 'Direktorat Kemahasiswaan',
      verified_at: formData.verifiedAt.trim(),
      is_active: formData.isActive,
    };

    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(payload)
        .eq('id', editingService.id);

      if (error) {
        setFormError('Gagal menyimpan perubahan layanan: ' + error.message);
        setSaving(false);
        return;
      }

      await recordAuditLog(
        'Edit Layanan',
        'Edit "' + payload.title + '" — pembaruan informasi layanan'
      );
    } else {
      const { error } = await supabase.from('services').insert([payload]);

      if (error) {
        setFormError('Gagal menambahkan layanan: ' + error.message);
        setSaving(false);
        return;
      }

      await recordAuditLog('Tambah Layanan', 'Tambah layanan "' + payload.title + '"');
    }

    setSaving(false);
    setIsModalOpen(false);
    fetchServices();
  };

  const toggleActive = async (service: ServiceItem) => {
    const nextStatus = !service.isActive;
    setTogglingId(service.id);

    const { error } = await supabase
      .from('services')
      .update({ is_active: nextStatus })
      .eq('id', service.id);

    if (!error) {
      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id ? { ...item, isActive: nextStatus } : item
        )
      );
      await recordAuditLog(
        'Edit Layanan',
        (nextStatus ? 'Mengaktifkan' : 'Menonaktifkan') + ' layanan "' + service.title + '"'
      );
    }

    setTogglingId(null);
  };

  const handleDelete = async (service: ServiceItem) => {
    const confirmed = window.confirm(
      'Yakin ingin menghapus layanan "' + service.title + '" secara permanen?'
    );
    if (!confirmed) return;

    const { error } = await supabase.from('services').delete().eq('id', service.id);

    if (!error) {
      setServices((prev) => prev.filter((item) => item.id !== service.id));
      await recordAuditLog('Hapus Layanan', 'Menghapus layanan "' + service.title + '"');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-[#4B5550] hover:text-[#1F5E47] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Settings size={24} style={{ color: '#1F5E47' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#181C1A' }}>
                Kelola Layanan
              </h1>
            </div>
            <p style={{ color: '#4B5550' }} className="text-sm">
              Tambah, edit, dan kelola status layanan yang tersedia di platform.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1F5E47', color: '#fff' }}
          >
            <Plus size={16} />
            Tambah Layanan
          </button>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: '#E5E9E6', backgroundColor: '#fff' }}
        >
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-[#4B5550]">
              Memuat daftar layanan dari database...
            </div>
          ) : services.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#4B5550]">
              Belum ada layanan yang terdaftar. Klik &quot;Tambah Layanan&quot; untuk membuat baru.
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
                      Judul
                    </th>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Kategori
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
                      Sumber
                    </th>
                    <th
                      className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide"
                      style={{ color: '#4B5550' }}
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, i) => {
                    const catStyle =
                      categoryBadge[service.category] || categoryBadge.Finansial;
                    return (
                      <tr
                        key={service.id}
                        style={{
                          borderTop: i > 0 ? '1px solid #E5E9E6' : undefined,
                        }}
                      >
                        <td className="px-6 py-4 font-medium" style={{ color: '#181C1A' }}>
                          {service.title}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
                          >
                            {service.category}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                            style={
                              service.isActive
                                ? { backgroundColor: '#E9F3EE', color: '#1F5E47' }
                                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                            }
                          >
                            {service.isActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs" style={{ color: '#4B5550' }}>
                          {service.source}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(service)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80"
                              style={{
                                borderColor: '#E5E9E6',
                                color: '#4B5550',
                                backgroundColor: '#fff',
                              }}
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={togglingId === service.id}
                              onClick={() => toggleActive(service)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                              style={
                                service.isActive
                                  ? { backgroundColor: '#FEF2F2', color: '#B91C1C' }
                                  : { backgroundColor: '#E9F3EE', color: '#1F5E47' }
                              }
                            >
                              {service.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(service)}
                              title="Hapus layanan"
                              className="inline-flex items-center justify-center p-1.5 rounded-lg text-xs border border-[#E5E9E6] text-[#6B7280] hover:text-[#B91C1C] hover:border-[#FECACA] transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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

      {/* Modal Tambah / Edit Layanan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-[#E5E9E6]">
            <div className="flex items-center justify-between border-b border-[#E5E9E6] pb-4 mb-5">
              <h2 className="text-lg font-bold text-[#181C1A]">
                {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-[#4B5550] hover:bg-[#F2F5F3]"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveService} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#181C1A] mb-1">
                    Judul Layanan *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Contoh: Bantuan Keringanan UKT"
                    className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#181C1A] mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ServiceCategory,
                      })
                    }
                    className="w-full rounded-xl border border-[#E5E9E6] bg-white px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#181C1A] mb-1">
                  Ringkasan Singkat *
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Penjelasan singkat tentang tujuan layanan ini..."
                  className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#181C1A] mb-1">
                  Alur Resmi (satu langkah per baris)
                </label>
                <textarea
                  rows={3}
                  value={formData.officialStepsText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      officialStepsText: e.target.value,
                    })
                  }
                  placeholder={'Siapkan dokumen prasyarat\nIsi formulir pengajuan online\nTunggu verifikasi admin 1-3 hari kerja'}
                  className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#181C1A] mb-1">
                  Dokumen Prasyarat (satu dokumen per baris)
                </label>
                <textarea
                  rows={3}
                  value={formData.prerequisitesText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prerequisitesText: e.target.value,
                    })
                  }
                  placeholder={'Kartu Tanda Mahasiswa (KTM) aktif\nTranskrip nilai terakhir'}
                  className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-[#181C1A] mb-1">
                    Nama Unit *
                  </label>
                  <input
                    type="text"
                    value={formData.unitName}
                    onChange={(e) =>
                      setFormData({ ...formData, unitName: e.target.value })
                    }
                    placeholder="Bagian Kemahasiswaan"
                    className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#181C1A] mb-1">
                    Email Unit
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    placeholder="unit@kampus.ac.id"
                    className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#181C1A] mb-1">
                    Telepon Unit
                  </label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    placeholder="022-xxxxxxx"
                    className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#181C1A] mb-1">
                    Sumber Data
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#181C1A] mb-1">
                    Tanggal Verifikasi
                  </label>
                  <input
                    type="text"
                    value={formData.verifiedAt}
                    onChange={(e) =>
                      setFormData({ ...formData, verifiedAt: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#E5E9E6] px-3.5 py-2 outline-none focus:border-[#1F5E47]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E9E6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#E5E9E6] px-4 py-2 font-medium text-[#4B5550] hover:bg-[#F9FAF8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#1F5E47] px-5 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}