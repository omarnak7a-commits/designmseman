import { useNavigate, useRouteParams } from "@/lib/router";
import { getExamByCode, getLeaderboard } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import logoSrc from "@/imports/Max_a_____________________.png";

export default function Leaderboard() {
  const navigate = useNavigate();
  const { code, attemptId } = useRouteParams<{ code: string; attemptId: string }>();
  const exam = getExamByCode(code);
  const entries = exam ? getLeaderboard(exam.id) : [];

  if (!exam) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center">
        <p className="text-[#64748b]">Exam not found.</p>
      </div>
    );
  }

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

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-[#0f172a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Leaderboard
          </h1>
          <p className="text-sm text-[#64748b] mt-1">{exam.title}</p>
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden mb-4">
          {entries.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[#64748b]">No results yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f1f5f9]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                    Rank
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                    Student
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                    Score
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden sm:table-cell">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const isCurrentStudent = entry.attemptId === attemptId;
                  return (
                    <tr
                      key={entry.attemptId}
                      className={[
                        "border-b border-[#f8fafc] transition-colors",
                        isCurrentStudent
                          ? "bg-[#eff6ff]"
                          : "hover:bg-[#f8fafc]",
                      ].join(" ")}
                    >
                      <td className="px-5 py-3.5">
                        <span
                          className={[
                            "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold",
                            entry.rank === 1
                              ? "bg-[#fbbf24] text-white"
                              : entry.rank === 2
                              ? "bg-[#94a3b8] text-white"
                              : entry.rank === 3
                              ? "bg-[#cd7c2f] text-white"
                              : "bg-[#f1f5f9] text-[#64748b]",
                          ].join(" ")}
                        >
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span
                          className={[
                            "font-medium",
                            isCurrentStudent ? "text-[#2563eb]" : "text-[#0f172a]",
                          ].join(" ")}
                          dir="auto"
                        >
                          {entry.studentName}
                          {isCurrentStudent && (
                            <span className="ml-1.5 text-xs text-[#2563eb]">(you)</span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="font-medium text-[#0f172a]">
                          {entry.score}/{entry.maxScore}
                        </span>
                        <span className="text-xs text-[#64748b] ml-1.5">
                          {entry.percentage}%
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-[#64748b] hidden sm:table-cell">
                        {formatTime(entry.timeUsed)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <button
          onClick={() => navigate(`/exam/${code}/result/${attemptId}`)}
          className="w-full py-3 text-sm font-medium border border-[#e2e8f0] rounded-[10px] text-[#64748b] hover:bg-[#f8fafc] transition-colors"
        >
          ← Back to Results
        </button>
      </main>
    </div>
  );
}
