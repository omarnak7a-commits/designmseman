import { useNavigate, useRouteParams } from "@/lib/router";
import { getAttempt, getExam } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import logoSrc from "@/imports/Max_a_____________________.png";

export default function ResultPage() {
  const navigate = useNavigate();
  const { code, attemptId } = useRouteParams<{ code: string; attemptId: string }>();
  const attempt = getAttempt(attemptId);
  const exam = attempt ? getExam(attempt.examId) : undefined;

  if (!attempt || !exam || !attempt.submitted) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center">
        <p className="text-[#64748b]">Result not found.</p>
      </div>
    );
  }

  const pct = attempt.percentage ?? 0;
  const grade =
    pct >= 90
      ? { label: "Excellent!", color: "#16a34a", bg: "#f0fdf4" }
      : pct >= 75
      ? { label: "Very Good!", color: "#2563eb", bg: "#eff6ff" }
      : pct >= 60
      ? { label: "Good", color: "#d97706", bg: "#fffbeb" }
      : { label: "Keep Practicing", color: "#dc2626", bg: "#fef2f2" };

  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-2.5">
          <img src={logoSrc} alt="Test Yourself" className="h-8 w-auto object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-[#1d4ed8]" style={{ fontFamily: "var(--font-display)" }}>
              Test Yourself
            </span>
            <span className="text-[10px] text-[#64748b]">Ms Eman Zahy</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-lg flex flex-col gap-5">
          {/* Main result card */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
            <div
              className="px-6 py-5 text-center"
              style={{ background: grade.bg }}
            >
              <p
                className="text-4xl font-bold mb-1"
                style={{ color: grade.color, fontFamily: "var(--font-display)" }}
              >
                {attempt.score}/{attempt.maxScore}
              </p>
              <p
                className="text-5xl font-black mb-2"
                style={{ color: grade.color, fontFamily: "var(--font-display)" }}
              >
                {pct}%
              </p>
              <p className="text-base font-semibold" style={{ color: grade.color }}>
                {grade.label}
              </p>
            </div>

            <div className="px-6 py-5">
              <h2
                className="font-semibold text-[#0f172a] mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your Result — {exam.title}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f0fdf4] rounded-xl p-3 text-center">
                  <p
                    className="text-2xl font-bold text-[#16a34a]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {attempt.correctCount ?? 0}
                  </p>
                  <p className="text-xs text-[#16a34a] font-medium mt-0.5">Correct</p>
                </div>
                <div className="bg-[#fef2f2] rounded-xl p-3 text-center">
                  <p
                    className="text-2xl font-bold text-[#dc2626]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {attempt.incorrectCount ?? 0}
                  </p>
                  <p className="text-xs text-[#dc2626] font-medium mt-0.5">Incorrect</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-[#f8fafc] rounded-xl p-3">
                  <p className="text-xs text-[#64748b] mb-0.5">Time Used</p>
                  <p className="font-semibold text-[#0f172a]">
                    {attempt.timeUsed ? formatTime(attempt.timeUsed) : "—"}
                  </p>
                </div>
                {exam.settings.allowRanking && attempt.rank && (
                  <div className="bg-[#f8fafc] rounded-xl p-3">
                    <p className="text-xs text-[#64748b] mb-0.5">Rank</p>
                    <p className="font-semibold text-[#0f172a]">#{attempt.rank}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {exam.settings.allowRanking && exam.settings.showRankingToStudents && (
              <button
                onClick={() =>
                  navigate(`/exam/${code}/leaderboard/${attemptId}`)
                }
                className="w-full py-3 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
              >
                View Leaderboard
              </button>
            )}
            {exam.settings.showAnswerReview && (
              <button
                onClick={() =>
                  navigate(`/exam/${code}/review/${attemptId}`)
                }
                className="w-full py-3 text-sm font-semibold border border-[#2563eb] text-[#2563eb] rounded-[10px] hover:bg-[#eff6ff] transition-colors"
              >
                Review All Answers
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
