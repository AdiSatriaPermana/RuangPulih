import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

const AccessDenied: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}
    >
      <div className="mb-6">
        <ShieldOff size={56} style={{ color: '#1F5E47', opacity: 0.6 }} />
      </div>

      <h1 className="text-2xl font-bold mb-3" style={{ color: '#181C1A' }}>
        Akses Terbatas
      </h1>

      <p
        className="text-sm max-w-sm mb-8 leading-relaxed"
        style={{ color: '#4B5550' }}
      >
        Halaman ini hanya dapat diakses oleh pengelola RuangPulih. Jika kamu
        merasa ini adalah kesalahan, hubungi administrator.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: '#1F5E47',
            color: '#FFFFFF',
          }}
        >
          Kembali ke Beranda
        </Link>
        <Link
          to="/masuk"
          className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#E5E9E6]"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1F5E47',
            border: '1px solid #E5E9E6',
          }}
        >
          Masuk sebagai Admin
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
