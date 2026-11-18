import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Tab = "masuk" | "demo";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("masuk");

  // Masuk form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = data.user;
    const isAdmin =
      user?.user_metadata?.role === "admin" ||
      user?.app_metadata?.role === "admin";

    navigate(isAdmin ? "/admin" : "/");
  };

  const handleDemoMahasiswa = () => {
    localStorage.removeItem("demoAdmin");
    navigate("/");
  };

  const handleDemoAdmin = () => {
    localStorage.setItem("demoAdmin", "true");
    navigate("/admin");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#F9FAF8", fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#1F5E47" }}
          >
            RuangPulih
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#4B5550" }}>
            Platform bantuan mahasiswa kampus
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-sm border"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E5E9E6",
          }}
        >
          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: "#F9FAF8", border: "1px solid #E5E9E6" }}
          >
            {(["masuk", "demo"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setError(null);
                }}
                className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-150"
                style={
                  activeTab === tab
                    ? {
                        backgroundColor: "#1F5E47",
                        color: "#FFFFFF",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }
                    : { color: "#4B5550" }
                }
              >
                {tab === "masuk" ? "Masuk" : "Demo"}
              </button>
            ))}
          </div>

          {/* Masuk tab */}
          {activeTab === "masuk" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#181C1A" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamu@kampus.ac.id"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #E5E9E6",
                    color: "#181C1A",
                    backgroundColor: "#F9FAF8",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(31,94,71,0.15)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                    style={{ color: "#181C1A" }}
                  >
                    Kata Sandi
                  </label>
                  <span
                    className="text-xs cursor-default select-none"
                    style={{ color: "#4B5550" }}
                  >
                    Lupa password?
                  </span>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: "1px solid #E5E9E6",
                    color: "#181C1A",
                    backgroundColor: "#F9FAF8",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(31,94,71,0.15)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                />
              </div>

              {error && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "#FEF2F2",
                    color: "#B91C1C",
                    border: "1px solid #FECACA",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity"
                style={{
                  backgroundColor: "#1F5E47",
                  color: "#FFFFFF",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Memproses…" : "Masuk"}
              </button>
            </form>
          )}

          {/* Demo tab */}
          {activeTab === "demo" && (
            <div className="space-y-4">
              <p className="text-sm text-center" style={{ color: "#4B5550" }}>
                Jelajahi RuangPulih tanpa perlu akun. Pilih peran yang ingin
                kamu simulasikan.
              </p>

              <button
                onClick={handleDemoMahasiswa}
                className="w-full py-3 rounded-xl text-sm font-medium border transition-colors"
                style={{
                  borderColor: "#1F5E47",
                  color: "#1F5E47",
                  backgroundColor: "#FFFFFF",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#E9F3EE")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#FFFFFF")
                }
              >
                Lihat sebagai Mahasiswa
              </button>

              <button
                onClick={handleDemoAdmin}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity"
                style={{
                  backgroundColor: "#1F5E47",
                  color: "#FFFFFF",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.opacity = "0.85")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
              >
                Lihat sebagai Admin (Simulasi)
              </button>

              <p
                className="text-xs text-center pt-1"
                style={{ color: "#4B5550" }}
              >
                Mode demo tidak menyimpan data apapun.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}