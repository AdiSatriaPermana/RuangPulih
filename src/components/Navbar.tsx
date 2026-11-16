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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1F5E47] text-sm font-bold text-white">
            RP
          </div>
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