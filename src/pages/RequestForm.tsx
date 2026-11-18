import { useState, useEffect, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  INITIAL_SERVICES,
  mapRowToServiceItem,
  type ServiceItem,
} from '../types/database';

export default function RequestForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loadingService, setLoadingService] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    namaLengkap: '',
    nim: '',
    email: '',
    noHp: '',
    deskripsi: '',
    checkMedis: false,
    checkData: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchService() {
      if (!slug) {
        setLoadingService(false);
        return;
      }
      setLoadingService(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setService(INITIAL_SERVICES.find((s) => s.slug === slug) || null);
      } else {
        setService(mapRowToServiceItem(data));
      }
      setLoadingService(false);
    }

    fetchService();
  }, [slug]);

  if (loadingService) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAF8] text-[#4B5550]">
        <p className="text-sm font-medium">Memuat formulir layanan...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAF8]">
        <div className="text-center space-y-4">
          <p className="text-[#4B5550] text-lg">Layanan tidak ditemukan.</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 rounded-xl bg-[#1F5E47] text-white text-sm font-medium hover:bg-[#174d39] transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.namaLengkap.trim()) e.namaLengkap = 'Nama lengkap wajib diisi.';
    if (!form.nim.trim()) e.nim = 'NIM / ID Mahasiswa wajib diisi.';
    if (!form.email.trim()) e.email = 'Email kampus wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Format email tidak valid.';
    if (!form.deskripsi.trim()) e.deskripsi = 'Deskripsi kebutuhan wajib diisi.';
    if (!form.checkMedis) e.checkMedis = 'Konfirmasi ini wajib dicentang.';
    if (!form.checkData) e.checkData = 'Persetujuan data wajib dicentang.';
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    // Cek apakah service.id berbentuk UUID valid dari Supabase
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      service.id
    );

    const { data, error } = await supabase
      .from('requests')
      .insert([
        {
          service_id: isUuid ? service.id : null,
          service_slug: service.slug,
          service_title: service.title,
          applicant_name: form.namaLengkap.trim(),
          applicant_nim: form.nim.trim(),
          applicant_email: form.email.trim(),
          applicant_phone: form.noHp.trim() || null,
          brief_purpose: form.deskripsi.trim(),
        },
      ])
      .select('reference_number')
      .single();

    setSubmitting(false);

    if (error || !data) {
      console.error('Gagal mengirim permohonan:', error);
      setSubmitError('Gagal mengirim permohonan ke server. Coba beberapa saat lagi.');
      return;
    }

    navigate('/ajukan/' + slug + '/sukses?ref=' + encodeURIComponent(data.reference_number));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
    setErrors((prev) => ({ ...prev, [target.name]: '' }));
  };

  return (
    <div className="min-h-screen bg-[#F9FAF8] py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          to={'/layanan/' + slug}
          className="inline-flex items-center gap-1.5 text-sm text-[#4B5550] hover:text-[#1F5E47] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke detail layanan
        </Link>

        <div className="bg-white border border-[#E5E9E6] rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-widest text-[#4B5550] font-semibold mb-1">
              Formulir Pengajuan
            </p>
            <h1 className="text-2xl font-bold text-[#181C1A]">{service.title}</h1>
            <p className="text-sm text-[#4B5550] mt-1">{service.summary}</p>
          </div>

          <div className="flex gap-3 items-start bg-[#FDF8EE] border border-[#F2DFC1] rounded-xl p-4 mb-6">
            <AlertTriangle size={18} className="text-[#7A541C] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#7A541C] leading-relaxed">
              <span className="font-semibold">Perhatian: </span>
              Jangan masukkan riwayat medis atau informasi sensitif pada formulir ini.
            </p>
          </div>

          {submitError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#181C1A] mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaLengkap"
                value={form.namaLengkap}
                onChange={handleChange}
                placeholder="Nama sesuai KTM"
                className={
                  errors.namaLengkap
                    ? 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all border-[#E5E9E6] focus:ring-2 focus:ring-[#1F5E47]/30 focus:border-[#1F5E47]'
                }
              />
              {errors.namaLengkap && (
                <p className="text-xs text-red-500 mt-1">{errors.namaLengkap}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#181C1A] mb-1.5">
                NIM / ID Mahasiswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nim"
                value={form.nim}
                onChange={handleChange}
                placeholder="Contoh: 20220001"
                className={
                  errors.nim
                    ? 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all border-[#E5E9E6] focus:ring-2 focus:ring-[#1F5E47]/30 focus:border-[#1F5E47]'
                }
              />
              {errors.nim && (
                <p className="text-xs text-red-500 mt-1">{errors.nim}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#181C1A] mb-1.5">
                Email Kampus <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@universitas.ac.id"
                className={
                  errors.email
                    ? 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all border-[#E5E9E6] focus:ring-2 focus:ring-[#1F5E47]/30 focus:border-[#1F5E47]'
                }
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#181C1A] mb-1.5">
                Nomor HP{' '}
                <span className="text-[#4B5550] font-normal text-xs">(opsional)</span>
              </label>
              <input
                type="tel"
                name="noHp"
                value={form.noHp}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E5E9E6] text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all focus:ring-2 focus:ring-[#1F5E47]/30 focus:border-[#1F5E47]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#181C1A] mb-1.5">
                Deskripsi Singkat Kebutuhan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleChange}
                rows={3}
                placeholder="Ceritakan secara singkat kebutuhanmu (tanpa informasi medis/sensitif)"
                className={
                  errors.deskripsi
                    ? 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all resize-none border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'w-full px-4 py-2.5 rounded-xl border text-sm text-[#181C1A] placeholder:text-[#A0A9A5] outline-none transition-all resize-none border-[#E5E9E6] focus:ring-2 focus:ring-[#1F5E47]/30 focus:border-[#1F5E47]'
                }
              />
              {errors.deskripsi && (
                <p className="text-xs text-red-500 mt-1">{errors.deskripsi}</p>
              )}
            </div>

            <div className="border-t border-[#E5E9E6] pt-4 space-y-3">
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="checkMedis"
                    checked={form.checkMedis}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 rounded accent-[#1F5E47] flex-shrink-0"
                  />
                  <span className="text-sm text-[#181C1A] leading-relaxed">
                    Saya memahami bahwa RuangPulih{' '}
                    <span className="font-semibold">bukan layanan medis/psikologis darurat</span>.{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.checkMedis && (
                  <p className="text-xs text-red-500 mt-1 pl-7">{errors.checkMedis}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="checkData"
                    checked={form.checkData}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 rounded accent-[#1F5E47] flex-shrink-0"
                  />
                  <span className="text-sm text-[#181C1A] leading-relaxed">
                    Saya menyetujui data minimal ini digunakan untuk kebutuhan pengajuan.{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.checkData && (
                  <p className="text-xs text-red-500 mt-1 pl-7">{errors.checkData}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#1F5E47] text-white text-sm font-semibold hover:bg-[#174d39] active:scale-[0.98] transition-all mt-2 disabled:opacity-60"
            >
              {submitting ? 'Mengirim Permohonan...' : 'Kirim Permohonan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}