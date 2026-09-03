import { useState } from "react";
import { useNavigate } from "@/lib/router";
import { login } from "@/lib/auth";
import logoSrc from "@/imports/Max_a_____________________.png";
import { useToast } from "@/components/ui/Toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));

    const ok = login(email, password);
    setLoading(false);

    if (ok) {
      toast("Welcome back, Ms Eman Zahy!");
      navigate("/teacher/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo area */}
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={logoSrc}
            alt="Test Yourself — Ms Eman Zahy"
            className="h-20 w-auto object-contain"
          />
          <div>
            <p className="text-sm text-[#64748b]">Teacher Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-sm">
          <h1
            className="text-xl font-bold text-[#0f172a] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sign in to your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-[#0f172a]">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@example.com"
                className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-[#0f172a]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-[#dc2626] bg-[#fef2f2] rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#64748b] cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm text-[#2563eb] hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#94a3b8]">
          Demo credentials: teacher@test.com / password
        </p>
      </div>
    </div>
  );
}
