import { useState } from "react";
import { useNavigate, useRouteParams } from "@/lib/router";
import { getExamByCode, createAttempt } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import logoSrc from "@/imports/Max_a_____________________.png";

export default function ExamEntry() {
  const navigate = useNavigate();
  const { code } = useRouteParams<{ code: string }>();
  const exam = getExamByCode(code);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!exam) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-sm text-center">
          <img src={logoSrc} alt="Test Yourself" className="h-14 w-auto object-contain mx-auto mb-6" />
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8">
            <div className="w-12 h-12 bg-[#fef2f2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-[#dc2626]">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-[#0f172a] mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Exam Not Found
            </h2>
            <p className="text-sm text-[#64748b]">
              This exam link is invalid or no longer available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (exam.status === "closed") {
    return (
      <div className="min-h-full bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-sm text-center">
          <img src={logoSrc} alt="Test Yourself" className="h-14 w-auto object-contain mx-auto mb-6" />
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8">
            <h2 className="text-lg font-bold text-[#0f172a] mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Exam Closed
            </h2>
            <p className="text-sm text-[#64748b]">This exam is currently closed.</p>
          </div>
        </div>
      </div>
    );
  }

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    try {
      const attempt = createAttempt(exam!.id, name.trim());
      navigate(`/exam/${code}/take/${attempt.id}`);
    } catch {
      setError("Failed to start exam. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logoSrc} alt="Test Yourself" className="h-8 w-auto object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-[#1d4ed8]" style={{ fontFamily: "var(--font-display)" }}>
                Test Yourself
              </span>
              <span className="text-[10px] text-[#64748b]">Ms Eman Zahy</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Exam info card */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 mb-6">
            <h1
              className="text-xl sm:text-2xl font-bold text-[#0f172a] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {exam.title}
            </h1>
            {exam.description && (
              <p className="text-sm text-[#64748b] mb-5">{exam.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#f8fafc] rounded-xl p-3">
                <p className="text-xs text-[#64748b] mb-0.5">Questions</p>
                <p className="font-semibold text-[#0f172a]">{exam.questions.length}</p>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-3">
                <p className="text-xs text-[#64748b] mb-0.5">Duration</p>
                <p className="font-semibold text-[#0f172a]">{formatDuration(exam.duration)}</p>
              </div>
            </div>

            {exam.instructions && (
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 mb-5">
                <p className="text-xs font-medium text-[#1d4ed8] mb-1.5">Instructions</p>
                <p className="text-sm text-[#1e40af] leading-relaxed">{exam.instructions}</p>
              </div>
            )}

            {/* Important notices */}
            <div className="border border-[#fde68a] bg-[#fffbeb] rounded-xl p-4 mb-5">
              <p className="text-xs font-medium text-[#92400e] mb-2">Important — please read before starting:</p>
              <ul className="text-xs text-[#92400e] space-y-1">
                <li>• The timer starts immediately when you click "Start Exam"</li>
                <li>• The exam cannot be paused once started</li>
                <li>• Your answers are automatically saved</li>
                <li>• The exam will auto-submit when time expires</li>
                <li>• You cannot change answers after submission</li>
              </ul>
            </div>

            {/* Student name */}
            <form onSubmit={handleStart} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0f172a]">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name..."
                  dir="auto"
                  className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-colors"
                  autoComplete="name"
                />
                <p className="text-xs text-[#94a3b8]">You can enter your name in Arabic or English</p>
              </div>

              {error && (
                <p className="text-sm text-[#dc2626] bg-[#fef2f2] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-3 text-base font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                )}
                {loading ? "Starting..." : "Start Exam"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
