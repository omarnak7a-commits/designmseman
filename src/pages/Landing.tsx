import { useNavigate } from "@/lib/router";
import logoSrc from "@/imports/Max_a_____________________.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-[#e2e8f0] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logoSrc} alt="Test Yourself" className="h-9 w-auto object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold text-[#1d4ed8]" style={{ fontFamily: "var(--font-display)" }}>
                Test Yourself
              </span>
              <span className="text-[11px] text-[#64748b]">Ms Eman Zahy</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-[#2563eb] border border-[#2563eb] rounded-[10px] hover:bg-[#eff6ff] transition-colors"
          >
            Teacher Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center">
        <div className="max-w-2xl flex flex-col items-center gap-8">
          <img
            src={logoSrc}
            alt="Test Yourself — Ms Eman Zahy"
            className="h-24 w-auto object-contain"
          />

          <div className="flex flex-col gap-4">
            <h1
              className="text-4xl sm:text-5xl font-bold text-[#0f172a] tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Test Your English.{" "}
              <span className="text-[#2563eb]">Know Your Level.</span>
            </h1>
            <p className="text-lg text-[#64748b] max-w-xl mx-auto leading-relaxed">
              Take carefully designed English exams, get instant results, and
              understand your performance — all in one place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/exam")}
              className="px-8 py-3 text-base font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors shadow-sm"
            >
              Take an Exam
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 text-base font-medium text-[#2563eb] border border-[#2563eb] rounded-[10px] hover:bg-[#eff6ff] transition-colors"
            >
              Teacher Login
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f8fafc] border-t border-[#e2e8f0] px-4 sm:px-6 py-16">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 106 5.196M13.5 10.5v-7.5"/>
                </svg>
              ),
              title: "Direct Exam Access",
              desc: "Open your exam directly from a unique link shared by your teacher — no account needed.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              ),
              title: "Instant Grading",
              desc: "Answers are automatically scored the moment you submit — no waiting.",
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-4.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0112.75 20.625V8.625zm-9 4.5"/>
                </svg>
              ),
              title: "Clear Results",
              desc: "See your score, rank, and a full review of every answer — with corrections where needed.",
            },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb]">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-[#0f172a] mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {f.title}
                </p>
                <p className="text-sm text-[#64748b] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] px-4 py-5">
        <p className="text-center text-xs text-[#94a3b8]">
          © {new Date().getFullYear()} Test Yourself · Ms Eman Zahy
        </p>
      </footer>
    </div>
  );
}
