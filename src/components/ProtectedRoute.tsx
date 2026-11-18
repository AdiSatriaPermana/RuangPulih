import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  const checkAdmin = useCallback(async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate('/masuk', { replace: true });
        return;
      }

      // Primary check: user_metadata.role
      if (user.user_metadata?.role === 'admin') {
        setChecking(false);
        return;
      }

      // Fallback check: profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profileError && profile?.is_admin === true) {
        setChecking(false);
        return;
      }

      // Logged in but not admin
      navigate('/akses-ditolak', { replace: true });
    } catch {
      navigate('/masuk', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#F9FAF8' }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <svg
            className="animate-spin h-10 w-10"
            style={{ color: '#1F5E47' }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p
            className="text-sm font-medium"
            style={{ color: '#181C1A' }}
          >
            Memeriksa akses…
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
