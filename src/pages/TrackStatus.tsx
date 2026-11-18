import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { RequestStatus } from '../types/database';
import StatusBadge from '../components/StatusBadge';

type BadgeStatus = 'Diterima' | 'Diproses' | 'Selesai';

interface TrackResult {
  ref: string;
  serviceTitle: string;
  status: BadgeStatus;
  message: string;
  timestamp: string;
}

function mapDbStatusToBadge(dbStatus: RequestStatus): {
  status: BadgeStatus;
  message: string;
} {
  switch (dbStatus) {
    case 'Submitted':
      return {
        status: 'Diterima',
        message:
          'Permohonan kamu telah kami terima dan sedang menunggu verifikasi.',
      };
    case 'In review':
      return {
        status: 'Diproses',
        message: 'Permohonan sedang ditinjau oleh pengelola layanan.',
      };
    case 'Referred':
      return {
        status: 'Diproses',
        message: 'Permohonan telah diteruskan ke unit layanan terkait.',
      };
    case 'Completed':
      return {
        status: 'Selesai',
        message:
          'Permohonan telah selesai diproses. Silakan cek email atau hubungi unit layanan.',
      };
  }
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';
}

const TrackStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [inputRef, setInputRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null | 'not-found'>(null);

  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setInputRef(refParam);
      handleSearch(refParam);
    }
  }, []);

  async function handleSearch(ref?: string) {
    const query = (ref ?? inputRef).trim().toUpperCase();
    if (!query) return;

    setLoading(true);
    setResult(null);

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('reference_number', query)
      .single();

    if (error || !data) {
      setResult('not-found');
    } else {
      const mapped = mapDbStatusToBadge(data.status as RequestStatus);
      setResult({
        ref: data.reference_number,
        serviceTitle: data.service_title,
        status: mapped.status,
        message: mapped.message,
        timestamp: formatTimestamp(data.updated_at || data.created_at),
      });
    }

    setLoading(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch();
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-16 px-4"
      style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}
    >
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#181C1A' }}>
            Lacak Status Ajuan
          </h1>
          <p className="text-sm" style={{ color: '#4B5550' }}>
            Masukkan nomor referensi untuk melihat status permohonanmu.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E9E6' }}
        >
          <label
            htmlFor="ref-input"
            className="block text-sm font-medium mb-2"
            style={{ color: '#181C1A' }}
          >
            Nomor Referensi
          </label>
          <input
            id="ref-input"
            type="text"
            value={inputRef}
            onChange={(e) => setInputRef(e.target.value)}
            placeholder="Contoh: RP-2026-001"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none mb-4 uppercase"
            style={{
              border: '1px solid #E5E9E6',
              backgroundColor: '#F9FAF8',
              color: '#181C1A',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#1F5E47' }}
          >
            <Search size={16} />
            {loading ? 'Mencari...' : 'Lacak'}
          </button>
        </form>

        {result === 'not-found' && (
          <div
            className="rounded-2xl p-6 text-center text-sm"
            style={{
              backgroundColor: '#FFF5F5',
              border: '1px solid #F5C6C6',
              color: '#7A2020',
            }}
          >
            Nomor referensi tidak ditemukan. Pastikan kode yang dimasukkan sudah benar.
          </div>
        )}

        {result && result !== 'not-found' && (
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E9E6' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium" style={{ color: '#4B5550' }}>
                Nomor Referensi
              </span>
              <StatusBadge status={result.status} />
            </div>

            <p className="text-base font-semibold mb-0.5" style={{ color: '#181C1A' }}>
              {result.ref}
            </p>
            <p className="text-xs font-medium mb-1" style={{ color: '#1F5E47' }}>
              Layanan: {result.serviceTitle}
            </p>
            <p className="text-xs mb-4" style={{ color: '#4B5550' }}>
              Pembaruan terakhir: {result.timestamp}
            </p>

            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: '#F9FAF8',
                border: '1px solid #E5E9E6',
                color: '#4B5550',
              }}
            >
              {result.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;