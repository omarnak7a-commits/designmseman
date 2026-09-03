import { useState, useMemo } from "react";
import TeacherLayout from "@/components/teacher/Layout";
import { useNavigate, useRouteParams } from "@/lib/router";
import { getExam, getAttemptsByExam } from "@/lib/store";
import Badge from "@/components/ui/Badge";
import { formatTime, formatDate } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

export default function Results() {
  const navigate = useNavigate();
  const { id } = useRouteParams<{ id: string }>();
  const exam = getExam(id);
  const allAttempts = getAttemptsByExam(id);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const attempts = useMemo(() => {
    return allAttempts.filter((a) => {
      if (filter === "completed" && !a.submitted) return false;
      if (filter === "submitted" && !a.submitted) return false;
      if (search && !a.studentName.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [allAttempts, filter, search]);

  const submitted = allAttempts.filter((a) => a.submitted);
  const avgScore =
    submitted.length > 0
      ? Math.round(
          submitted.reduce((s, a) => s + (a.percentage ?? 0), 0) /
            submitted.length
        )
      : 0;
  const highest = submitted.reduce(
    (max, a) => Math.max(max, a.percentage ?? 0),
    0
  );
  const lowest =
    submitted.length > 0
      ? submitted.reduce((min, a) => Math.min(min, a.percentage ?? 100), 100)
      : 0;

  if (!exam) {
    return (
      <TeacherLayout>
        <div className="p-6">
          <p className="text-[#64748b]">Exam not found.</p>
        </div>
      </TeacherLayout>
    );
  }

  return (
    <TeacherLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/teacher/exams")}
          className="text-sm text-[#64748b] hover:text-[#0f172a] flex items-center gap-1 mb-4 transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" />
          </svg>
          Back to Exams
        </button>

        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-[#0f172a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Results: {exam.title}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total Students", value: allAttempts.length },
            { label: "Completed", value: submitted.length },
            { label: "Average Score", value: `${avgScore}%` },
            { label: "Highest Score", value: `${highest}%` },
            { label: "Lowest Score", value: `${lowest}%` },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-4 text-center"
            >
              <p
                className="text-2xl font-bold text-[#0f172a]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </p>
              <p className="text-xs text-[#64748b] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl">
            {["all", "completed", "submitted"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  "px-3 py-1.5 text-sm rounded-lg transition-colors font-medium capitalize",
                  filter === f
                    ? "bg-white text-[#0f172a] shadow-sm"
                    : "text-[#64748b]",
                ].join(" ")}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
          />
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          {attempts.length === 0 ? (
            <EmptyState
              title="No results yet"
              description="No students have completed this exam yet."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    <th className="text-left px-5 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                      Student
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden sm:table-cell">
                      Score
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden sm:table-cell">
                      %
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden md:table-cell">
                      Time
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden md:table-cell">
                      Rank
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden md:table-cell">
                      Submitted
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-[#f8fafc] hover:bg-[#f8fafc] transition-colors"
                    >
                      <td className="px-5 py-4 font-medium text-[#0f172a]">
                        {a.studentName}
                      </td>
                      <td className="px-3 py-4 text-[#64748b] hidden sm:table-cell">
                        {a.submitted
                          ? `${a.score}/${a.maxScore}`
                          : "—"}
                      </td>
                      <td className="px-3 py-4 hidden sm:table-cell">
                        {a.submitted ? (
                          <span
                            className={
                              (a.percentage ?? 0) >= 70
                                ? "text-[#16a34a] font-medium"
                                : (a.percentage ?? 0) >= 50
                                ? "text-[#d97706] font-medium"
                                : "text-[#dc2626] font-medium"
                            }
                          >
                            {a.percentage}%
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-4 text-[#64748b] hidden md:table-cell">
                        {a.submitted && a.timeUsed
                          ? formatTime(a.timeUsed)
                          : "—"}
                      </td>
                      <td className="px-3 py-4 text-[#64748b] hidden md:table-cell">
                        {a.rank ? `#${a.rank}` : "—"}
                      </td>
                      <td className="px-3 py-4 text-[#64748b] hidden md:table-cell">
                        {a.submittedAt ? formatDate(a.submittedAt) : "—"}
                      </td>
                      <td className="px-3 py-4">
                        <Badge variant={a.submitted ? "active" : "draft"}>
                          {a.submitted ? "Completed" : "In Progress"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {a.submitted && (
                          <button
                            onClick={() =>
                              navigate(`/teacher/results/${a.id}`)
                            }
                            className="text-xs text-[#2563eb] hover:underline font-medium"
                          >
                            View Result
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
