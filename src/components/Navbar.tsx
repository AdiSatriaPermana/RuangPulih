import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onOpenHelp: () => void;
}

export default function Navbar({ onOpenHelp }: NavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E9E6] bg-[#FBFBF9]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <svg
            className="h-8 w-8 shrink-0"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="64" height="64" rx="16" fill="#1F5E47" />
            <path
              d="M32 13L47 19.5V31.5C47 41.2 40.6 49.8 32 52.5C23.4 49.8 17 41.2 17 31.5V19.5L32 13Z"
              fill="#E9F3EE"
            />
            <path
              d="M32 23V41M23 32H41"
              stroke="#1F5E47"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight text-[#181C1A]">
            Ruang Pulih
          </span>
        </Link>

        {/* Menu Navigasi */}
        <nav className="flex items-center gap-5 sm:gap-7">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/')
                ? 'font-semibold text-[#1F5E47]'
                : 'text-[#4B5550] hover:text-[#181C1A]'
            }`}
          >
            Direktori
          </Link>

          <Link
            to="/lacak"
            className={`text-sm font-medium transition-colors ${
              isActive('/lacak')
                ? 'font-semibold text-[#1F5E47]'
                : 'text-[#4B5550] hover:text-[#181C1A]'
            }`}
          >
            Lacak Status
          </Link>

          <button
            type="button"
            onClick={onOpenHelp}
            className="text-sm font-medium text-[#4B5550] transition-colors hover:text-[#181C1A]"
          >
            Bantuan
          </button>

          <Link
            to="/masuk"
            className="rounded-lg border border-[#D4DDD8] bg-white px-4 py-2 text-sm font-semibold text-[#181C1A] transition-colors hover:bg-[#F2F5F3]"
          >
            Masuk
          </Link>
        </nav>
      </div>
    </header>
  );
}