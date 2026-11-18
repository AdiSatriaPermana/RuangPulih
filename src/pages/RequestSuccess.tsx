import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, Check } from 'lucide-react';

export default function RequestSuccess() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') ?? 'RP-2026-????';

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select the text
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF8] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white border border-[#E5E9E6] rounded-2xl p-8 shadow-sm text-center">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-[#E9F3EE] flex items-center justify-center">
              <CheckCircle size={36} className="text-[#1F5E47]" strokeWidth={1.8} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-[#181C1A] mb-2">
            Permohonan Terkirim!
          </h1>
          <p className="text-sm text-[#4B5550] leading-relaxed mb-6">
            Terima kasih telah mengajukan permohonan. Tim kami akan segera memproses
            ajuanmu dalam 1–3 hari kerja.
          </p>

          {/* Reference number box */}
          <div className="bg-[#F9FAF8] border border-[#E5E9E6] rounded-xl p-4 mb-2">
            <p className="text-xs uppercase tracking-widest text-[#4B5550] font-semibold mb-2">
              Nomor Referensi
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xl font-bold text-[#1F5E47] tracking-wide font-mono">
                {ref}
              </span>
              <button
                onClick={handleCopy}
                title="Salin nomor referensi"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E9E6] text-xs text-[#4B5550] hover:border-[#1F5E47] hover:text-[#1F5E47] transition-colors flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={13} />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Salin
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-[#4B5550] mb-8">
            Simpan nomor ini untuk melacak status ajuanmu.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/lacak?ref=${encodeURIComponent(ref)}`}
              className="flex-1 py-2.5 rounded-xl bg-[#1F5E47] text-white text-sm font-semibold text-center hover:bg-[#174d39] active:scale-[0.98] transition-all"
            >
              Lacak Status
            </Link>
            <Link
              to="/"
              className="flex-1 py-2.5 rounded-xl border border-[#E5E9E6] text-[#181C1A] text-sm font-semibold text-center hover:border-[#1F5E47] hover:text-[#1F5E47] active:scale-[0.98] transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
