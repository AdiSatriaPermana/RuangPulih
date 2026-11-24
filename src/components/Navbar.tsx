import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Pasang jika belum ada, atau pakai svg
import supabase from '../lib/supabase';

interface NavbarProps {
  onOpenHelp: () => void;
}

export default function Navbar({ onOpenHelp }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State untuk menu mobile

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const checkStatus = async () => {
      if (localStorage.getItem('demoAdmin') === 'true') {
        setIsAdminLoggedIn(true);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAdminLoggedIn(!!session?.user);
    };

    checkStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isDemo = localStorage.getItem('demoAdmin') === 'true';
      setIsAdminLoggedIn(isDemo || !!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [location.pathname]);

  const handleLogout = async () => {
    localStorage.removeItem('demoAdmin');
    await supabase.auth.signOut();
    setIsAdminLoggedIn(false);
    setIsOpen(false);
    navigate('/masuk');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E9E6] bg-[#FBFBF9]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <svg
              className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
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
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#181C1A] whitespace-nowrap">
              Ruang Pulih
            </span>
          </Link>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-6">
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

            {isAdminLoggedIn && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'font-semibold text-[#1F5E47]'
                    : 'text-[#4B5550] hover:text-[#181C1A]'
                }`}
              >
                Dasbor
              </Link>
            )}

            <button
              type="button"
              onClick={onOpenHelp}
              className="text-sm font-medium text-[#4B5550] transition-colors hover:text-[#181C1A]"
            >
              Bantuan
            </button>
          </nav>

          {/* Tombol Masuk / Keluar (Desktop) */}
          <div className="hidden md:block">
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-sm font-semibold text-[#B91C1C] transition-colors hover:bg-[#FEE2E2]"
              >
                Keluar
              </button>
            ) : (
              <Link
                to="/masuk"
                className="rounded-lg border border-[#D4DDD8] bg-white px-4 py-2 text-sm font-semibold text-[#181C1A] transition-colors hover:bg-[#F2F5F3]"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Tombol Menu Mobile (Hamburger) */}
          <div className="flex md:hidden items-center gap-3">
            {!isAdminLoggedIn ? (
              <Link
                to="/masuk"
                className="rounded-lg border border-[#D4DDD8] bg-white px-3 py-1.5 text-xs font-semibold text-[#181C1A] transition-colors"
              >
                Masuk
              </Link>
            ) : null}
            
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-1.5 text-[#4B5550] hover:bg-[#F2F5F3] hover:text-[#181C1A] transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Panel Navigasi Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-3 border-t border-[#E5E9E6]/60 pt-3 pb-2 space-y-1 animate-fade-in">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-[#E9F3EE] text-[#1F5E47] font-semibold'
                  : 'text-[#4B5550] hover:bg-[#F2F5F3]'
              }`}
            >
              Direktori
            </Link>

            <Link
              to="/lacak"
              onClick={() => setIsOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/lacak')
                  ? 'bg-[#E9F3EE] text-[#1F5E47] font-semibold'
                  : 'text-[#4B5550] hover:bg-[#F2F5F3]'
              }`}
            >
              Lacak Status
            </Link>

            {isAdminLoggedIn && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-[#E9F3EE] text-[#1F5E47] font-semibold'
                    : 'text-[#4B5550] hover:bg-[#F2F5F3]'
                }`}
              >
                Dasbor
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenHelp();
              }}
              className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-[#4B5550] hover:bg-[#F2F5F3] transition-colors"
            >
              Bantuan
            </button>

            {isAdminLoggedIn && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-sm font-semibold text-[#B91C1C] text-center"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}