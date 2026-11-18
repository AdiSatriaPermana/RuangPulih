import { useState } from 'react';
import { Settings, Plus, Pencil } from 'lucide-react';
import { INITIAL_SERVICES, type ServiceCategory } from '../../types/database';

const categoryBadge: Record<ServiceCategory, { bg: string; color: string }> = {
  Finansial: { bg: '#E9F3EE', color: '#1F5E47' },
  Akademik: { bg: '#EDF2F7', color: '#2C4A6E' },
  'Bantuan Sosial': { bg: '#F5EFE6', color: '#6E4E24' },
};

export default function ManageServices() {
  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(
    Object.fromEntries(INITIAL_SERVICES.map((s) => [s.id, s.isActive]))
  );

  const toggleActive = (id: string) => {
    setActiveMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Settings size={24} style={{ color: '#1F5E47' }} />
              <h1 className="text-2xl font-bold" style={{ color: '#181C1A' }}>Kelola Layanan</h1>
            </div>
            <p style={{ color: '#4B5550' }} className="text-sm">Tambah, edit, dan kelola status layanan yang tersedia di platform.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: '#1F5E47', color: '#fff' }}
          >
            <Plus size={16} />
            Tambah Layanan
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#E5E9E6', backgroundColor: '#fff' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F9FAF8' }}>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Judul</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Kategori</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Status</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Sumber</th>
                <th className="text-left px-6 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: '#4B5550' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_SERVICES.map((service, i) => {
                const isActive = activeMap[service.id];
                const catStyle = categoryBadge[service.category];
                return (
                  <tr
                    key={service.id}
                    style={{
                      borderTop: i > 0 ? '1px solid #E5E9E6' : undefined,
                    }}
                  >
                    {/* Judul */}
                    <td className="px-6 py-4 font-medium" style={{ color: '#181C1A' }}>
                      {service.title}
                    </td>

                    {/* Kategori */}
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: catStyle.bg, color: catStyle.color }}
                      >
                        {service.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={
                          isActive
                            ? { backgroundColor: '#E9F3EE', color: '#1F5E47' }
                            : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                        }
                      >
                        {isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>

                    {/* Sumber */}
                    <td className="px-6 py-4 text-xs" style={{ color: '#4B5550' }}>
                      {service.source}
                    </td>

                    {/* Aksi */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80"
                          style={{ borderColor: '#E5E9E6', color: '#4B5550', backgroundColor: '#fff' }}
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleActive(service.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                          style={
                            isActive
                              ? { backgroundColor: '#FEF2F2', color: '#B91C1C' }
                              : { backgroundColor: '#E9F3EE', color: '#1F5E47' }
                          }
                        >
                          {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
