import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E9E6] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#181C1A]">
            Bantuan &amp; privasi
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 text-xs font-medium text-[#4B5550] hover:text-[#181C1A]"
          >
            <span>Tutup</span>
            <X className="h-4 w-4" />
          </button>
        </div>

        <ol className="mt-4 space-y-2 text-sm text-[#2D3330]">
          <li>1. Pilih layanan dari direktori atau pencarian.</li>
          <li>2. Baca alur resmi dan dokumen prasyarat.</li>
          <li>3. Lengkapi formulir dan persetujuan privasi.</li>
          <li>4. Simpan nomor referensi untuk melacak ajuan.</li>
        </ol>

        <div className="mt-4 rounded-xl border border-[#F2DFC1] bg-[#FDF8EE] p-3.5 text-xs leading-relaxed text-[#7A541C]">
          <p className="font-semibold">
            Jangan masukkan riwayat medis atau informasi kesehatan mental.
          </p>
          <p className="mt-1">
            RuangPulih bukan layanan diagnosis atau darurat.
          </p>
        </div>

        <div className="mt-4 space-y-1 text-xs text-[#5A635E]">
          <p>Kontak : info@uinsgd.ac.id / humas_aljamiah@uinsgd.ac.idd</p>
          <p>Nomor telepon : (022) 7800525</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-[#1F5E47] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#184B38]"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}