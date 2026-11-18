import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  INITIAL_SERVICES,
  mapRowToServiceItem,
  type ServiceCategory,
  type ServiceItem,
} from '../types/database';

const categoryStyles: Record<ServiceCategory, { bg: string; text: string; border: string; label: string }> = {
  Finansial: {
    bg: '#E9F3EE',
    text: '#1F5E47',
    border: '#C0D9CB',
    label: 'Finansial',
  },
  Akademik: {
    bg: '#EDF2F7',
    text: '#2C4A6E',
    border: '#C5D5E8',
    label: 'Akademik',
  },
  'Bantuan Sosial': {
    bg: '#F5EFE6',
    text: '#6E4E24',
    border: '#E2CEAD',
    label: 'Bantuan Sosial',
  },
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServiceDetail() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        const fallback = INITIAL_SERVICES.find((s) => s.slug === slug) || null;
        setService(fallback);
      } else {
        setService(mapRowToServiceItem(data));
      }
      setLoading(false);
    }

    fetchServiceDetail();
  }, [slug]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F9FAF8', color: '#4B5550' }}
      >
        <p className="text-sm font-medium">Memuat detail layanan...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}
      >
        <div className="text-center">
          <p className="text-6xl font-bold mb-4" style={{ color: '#1F5E47' }}>404</p>
          <h1 className="text-2xl font-semibold mb-2">Layanan Tidak Ditemukan</h1>
          <p className="mb-6" style={{ color: '#4B5550' }}>
            Layanan yang kamu cari tidak tersedia atau alamat tidak valid.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-medium transition-colors hover:underline"
            style={{ color: '#1F5E47' }}
          >
            ← Kembali ke Direktori
          </Link>
        </div>
      </div>
    );
  }

  const catStyle = categoryStyles[service.category];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium mb-6 transition-colors hover:underline"
          style={{ color: '#4B5550' }}
        >
          ← Kembali ke Direktori
        </Link>

        <nav
          className="flex flex-wrap items-center gap-1.5 text-sm mb-6"
          style={{ color: '#4B5550' }}
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:underline transition-colors" style={{ color: '#1F5E47' }}>
            Beranda
          </Link>
          <span>/</span>
          <span>{service.category}</span>
          <span>/</span>
          <span className="truncate max-w-[200px]" style={{ color: '#181C1A' }}>{service.title}</span>
        </nav>

        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{
            backgroundColor: catStyle.bg,
            color: catStyle.text,
            border: '1px solid ' + catStyle.border,
          }}
        >
          {catStyle.label}
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight" style={{ color: '#181C1A' }}>
          {service.title}
        </h1>

        <p className="text-base mb-4 leading-relaxed" style={{ color: '#4B5550' }}>
          {service.summary}
        </p>

        <p className="text-xs mb-8" style={{ color: '#4B5550' }}>
          Diverifikasi: <span className="font-medium">{service.verifiedAt}</span>
          {' · '}
          Sumber: <span className="font-medium">{service.source}</span>
        </p>

        <div className="border-t mb-8" style={{ borderColor: '#E5E9E6' }} />

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#181C1A' }}>
            Alur Resmi
          </h2>
          <ol className="space-y-3">
            {service.officialSteps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: '#E9F3EE', color: '#1F5E47' }}
                >
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed" style={{ color: '#4B5550' }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="border-t mb-8" style={{ borderColor: '#E5E9E6' }} />

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#181C1A' }}>
            Dokumen Prasyarat
          </h2>
          <ul className="space-y-2">
            {service.prerequisites.map((doc, index) => (
              <li key={index} className="flex gap-3 items-start">
                <span
                  className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#1F5E47' }}
                />
                <span className="text-sm leading-relaxed" style={{ color: '#4B5550' }}>
                  {doc}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t mb-8" style={{ borderColor: '#E5E9E6' }} />

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#181C1A' }}>
            Kontak Unit
          </h2>
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E9E6' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span
                className="text-xs font-semibold uppercase tracking-wide w-24 flex-shrink-0"
                style={{ color: '#4B5550' }}
              >
                Unit
              </span>
              <span className="text-sm font-medium" style={{ color: '#181C1A' }}>
                {service.unitName}
              </span>
            </div>
            <div className="border-t" style={{ borderColor: '#E5E9E6' }} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span
                className="text-xs font-semibold uppercase tracking-wide w-24 flex-shrink-0"
                style={{ color: '#4B5550' }}
              >
                Email
              </span>
              <a
                href={'mailto:' + service.contactEmail}
                className="text-sm transition-colors hover:underline"
                style={{ color: '#1F5E47' }}
              >
                {service.contactEmail}
              </a>
            </div>
            <div className="border-t" style={{ borderColor: '#E5E9E6' }} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span
                className="text-xs font-semibold uppercase tracking-wide w-24 flex-shrink-0"
                style={{ color: '#4B5550' }}
              >
                Telepon
              </span>
              <a
                href={'tel:' + service.contactPhone}
                className="text-sm transition-colors hover:underline"
                style={{ color: '#1F5E47' }}
              >
                {service.contactPhone}
              </a>
            </div>
          </div>
        </section>

        <div className="flex justify-center sm:justify-start">
          <Link
            to={'/ajukan/' + service.slug}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            style={{ backgroundColor: '#1F5E47' }}
          >
            Ajukan Permohonan
          </Link>
        </div>

      </div>
    </div>
  );
}