import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  INITIAL_SERVICES,
  mapRowToServiceItem,
  type ServiceCategory,
  type ServiceItem,
} from '../types/database';
import ServiceCard from '../components/ServiceCard';

type FilterTab = 'Semua' | ServiceCategory;

export default function Home() {
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterTab>('Semua');

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        setServices(INITIAL_SERVICES);
      } else {
        setServices(data.map(mapRowToServiceItem));
      }
      setLoading(false);
    }

    fetchServices();
  }, []);

  const categories: FilterTab[] = [
    'Semua',
    'Finansial',
    'Akademik',
    'Bantuan Sosial',
  ];

  const filteredServices = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === 'Semua' || service.category === selectedCategory;

      const matchesSearch =
        trimmed === '' ||
        service.title.toLowerCase().includes(trimmed) ||
        service.summary.toLowerCase().includes(trimmed) ||
        service.category.toLowerCase().includes(trimmed);

      return matchesCategory && matchesSearch;
    });
  }, [services, searchQuery, selectedCategory]);

  const displayedServices = useMemo(() => {
    if (searchQuery.trim() === '' && selectedCategory === 'Semua') {
      return filteredServices.slice(0, 6);
    }
    return filteredServices;
  }, [filteredServices, searchQuery, selectedCategory]);

  const isSearching = searchQuery.trim() !== '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl">
        <span className="inline-block rounded-full bg-[#E9F3EE] px-3 py-1 text-xs font-bold tracking-wider text-[#1F5E47] uppercase">
          LAYANAN MAHASISWA
        </span>

        <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-[#181C1A] sm:text-5xl">
          Temukan bantuan kampus, tanpa bingung prosedur.
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[#4B5550] sm:text-lg">
          Cari unit bantuan, pahami alur resmi, ajukan permohonan, dan pantau
          statusnya dalam satu tempat.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[#E5E9E6] bg-white p-5 shadow-2xs sm:p-6">
        <label
          htmlFor="service-search"
          className="block text-sm font-bold text-[#181C1A]"
        >
          Mulai dari kebutuhanmu
        </label>
        <p className="mt-0.5 text-xs text-[#5A635E]">
          Cari layanan yang paling sesuai
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#7A847E]" />
            <input
              id="service-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Contoh: beasiswa, konseling..."
              className="w-full rounded-xl border border-[#D4DDD8] bg-[#FBFBF9] py-2.5 pr-4 pl-10 text-sm text-[#181C1A] placeholder-[#8A948E] focus:border-[#1F5E47] focus:bg-white focus:outline-none"
            />
          </div>
          {isSearching && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="rounded-xl border border-[#D4DDD8] bg-white px-5 py-2.5 text-sm font-semibold text-[#181C1A] hover:bg-[#F2F5F3]"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold text-[#181C1A] sm:text-2xl">
              {isSearching
                ? 'Hasil pencarian: "' + searchQuery.trim() + '"'
                : selectedCategory !== 'Semua'
                ? 'Kategori: ' + selectedCategory
                : 'Direktori layanan'}
            </h2>
            <p className="mt-1 text-sm text-[#4B5550]">
              {isSearching
                ? displayedServices.length + ' layanan ditemukan berdasarkan kata kunci yang kamu masukkan.'
                : selectedCategory !== 'Semua'
                ? displayedServices.length + ' layanan tersedia dalam kategori ' + selectedCategory + '.'
                : 'Pilih kategori layanan untuk menemukan bantuan yang tepat.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    active
                      ? 'rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors bg-[#1F5E47] text-white'
                      : 'rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors border border-[#DCE3DF] bg-white text-[#4B5550] hover:bg-[#F2F5F3]'
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-52 animate-pulse rounded-2xl border border-[#E5E9E6] bg-white p-6"
              />
            ))}
          </div>
        ) : displayedServices.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                showMetadata={isSearching}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-[#E5E9E6] bg-white p-10 text-center">
            <p className="text-sm font-semibold text-[#181C1A]">
              Layanan tidak ditemukan
            </p>
            <p className="mt-1 text-xs text-[#5A635E]">
              Coba kata kunci lain seperti &quot;beasiswa&quot;,
              &quot;konseling&quot;, atau pilih kategori Semua.
            </p>
          </div>
        )}
      </section>

      <footer className="mt-14 border-t border-[#E5E9E6] pt-6 text-center text-xs text-[#5A635E]">
        RuangPulih adalah media informasi dan alur pengajuan bantuan bukan
        layanan diagnosis atau darurat.
      </footer>
    </div>
  );
}