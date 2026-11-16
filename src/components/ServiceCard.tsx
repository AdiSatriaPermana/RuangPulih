import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ServiceItem } from '../types/database';
interface ServiceCardProps {
  service: ServiceItem;
  showMetadata?: boolean;
}

export default function ServiceCard({
  service,
  showMetadata = false,
}: ServiceCardProps) {
  const getCategoryBadgeStyle = (category: ServiceItem['category']) => {
    switch (category) {
      case 'Finansial':
        return 'bg-[#E9F3EE] text-[#1F5E47]';
      case 'Akademik':
        return 'bg-[#EDF2F7] text-[#2C4A6E]';
      case 'Bantuan Sosial':
        return 'bg-[#F5EFE6] text-[#6E4E24]';
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E5E9E6] bg-white p-6 transition-shadow hover:shadow-sm">
      <div>
        <span
          className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${getCategoryBadgeStyle(
            service.category
          )}`}
        >
          {service.category}
        </span>

        <h3 className="mt-3.5 text-lg font-bold text-[#181C1A]">
          {service.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#4B5550]">
          {service.summary}
        </p>

        {showMetadata && (
          <p className="mt-3 text-xs text-[#6B7570]">
            Diverifikasi: {service.verifiedAt} · Sumber: {service.source}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#F0F3F1] pt-4">
        <Link
          to={`/layanan/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F5E47] transition-colors hover:text-[#164433]"
        >
          <span>Detail layanan</span>
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          to={`/ajukan/${service.slug}`}
          className="rounded-lg bg-[#1F5E47] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#184B38]"
        >
          Ajukan
        </Link>
      </div>
    </div>
  );
}