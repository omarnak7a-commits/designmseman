import { useMemo } from "react";
import TeacherLayout from "@/components/teacher/Layout";
import { useNavigate } from "@/lib/router";
import { getExams, getAttempts } from "@/lib/store";
import { getTeacher } from "@/lib/store";
import Badge from "@/components/ui/Badge";
import { formatDate, formatDuration } from "@/lib/utils";
import type { ExamStatus } from "@/lib/types";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#eff6ff] flex items-center justify-center text-[#2563eb] flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>
          {value}
        </p>
        <p className="text-sm text-[#64748b]">{label}</p>
      </div>
    </div>
  );
}

const statusVariant: Record<ExamStatus, "draft" | "published" | "active" | "closed"> = {
  draft: "draft",
  published: "published",
  active: "active",
  closed: "closed",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const teacher = getTeacher();
  const exams = getExams();
  const attempts = getAttempts();

  const stats = useMemo(() => {
    const submitted = attempts.filter((a) => a.submitted);
    const totalStudents = new Set(attempts.map((a) => a.studentName)).size;
    const avgScore =
      submitted.length > 0
        ? Math.round(
            submitted.reduce((sum, a) => sum + (a.percentage ?? 0), 0) /
              submitted.length
          )
        : 0;
    return {
      totalExams: exams.length,
      totalStudents,
      totalAttempts: submitted.length,
      avgScore,
    };
  }, [exams, attempts]);

  const recentExams = useMemo(
    () => [...exams].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [exams]
  );

  return (
    <TeacherLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1
            className="text-2xl font-bold text-[#0f172a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back, {teacher.name}
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            Here&apos;s an overview of your examination activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Exams"
            value={stats.totalExams}
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3.5 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5zm0 3a.75.75 0 000 1.5h5a.75.75 0 000-1.5h-5zm0 3a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
              </svg>
            }
          />
          <StatCard
            label="Total Students"
            value={stats.totalStudents}
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path d="M7 8a3 3 0 100-6 3 3 0 000 6zm7-3a2 2 0 11-4 0 2 2 0 014 0zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 17a9.953 9.953 0 01-5.385-1.572z" />
              </svg>
            }
          />
          <StatCard
            label="Total Attempts"
            value={stats.totalAttempts}
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" />
              </svg>
            }
          />
          <StatCard
            label="Average Score"
            value={`${stats.avgScore}%`}
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2h11l-3.5 3.5a.75.75 0 101.06 1.06l5-5a.75.75 0 000-1.06l-5-5a.75.75 0 00-1.06 1.06L14 4H3zm0 9a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5A.75.75 0 013 12z" />
              </svg>
            }
          />
        </div>

        {/* Recent exams */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <h2 className="font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>
              Recent Exams
            </h2>
            <button
              onClick={() => navigate("/teacher/exams")}
              className="text-sm text-[#2563eb] hover:underline"
            >
              View all
            </button>
          </div>

          {recentExams.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[#64748b] mb-3">No exams yet.</p>
              <button
                onClick={() => navigate("/teacher/exams/create")}
                className="text-sm text-[#2563eb] font-medium hover:underline"
              >
                Create your first exam →
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f1f5f9]">
                    <th className="text-left px-6 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                      Exam
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden sm:table-cell">
                      Questions
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden md:table-cell">
                      Duration
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide hidden md:table-cell">
                      Attempts
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-[#64748b] uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentExams.map((exam) => {
                    const examAttempts = attempts.filter(
                      (a) => a.examId === exam.id && a.submitted
                    );
                    return (
                      <tr
                        key={exam.id}
                        className="border-b border-[#f8fafc] hover:bg-[#f8fafc] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-[#0f172a]">{exam.title}</p>
                            <p className="text-xs text-[#94a3b8] mt-0.5">{formatDate(exam.createdAt)}</p>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-[#64748b] hidden sm:table-cell">
                          {exam.questions.length}
                        </td>
                        <td className="px-3 py-4 text-[#64748b] hidden md:table-cell">
                          {formatDuration(exam.duration)}
                        </td>
                        <td className="px-3 py-4 text-[#64748b] hidden md:table-cell">
                          {examAttempts.length}
                        </td>
                        <td className="px-3 py-4">
                          <Badge variant={statusVariant[exam.status]}>
                            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
                              className="text-xs text-[#2563eb] hover:underline font-medium"
                            >
                              Results
                            </button>
                            <button
                              onClick={() => navigate(`/teacher/exams/${exam.id}`)}
                              className="text-xs text-[#64748b] hover:underline"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
