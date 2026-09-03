import { useMemo } from "react";
import TeacherLayout from "@/components/teacher/Layout";
import { useNavigate } from "@/lib/router";
import { getExams, getAttempts } from "@/lib/store";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { ExamStatus } from "@/lib/types";
import EmptyState from "@/components/ui/EmptyState";

export default function TeacherResultsRedirect() {
  const navigate = useNavigate();
  const exams = getExams();
  const attempts = getAttempts();

  const examsWithResults = useMemo(() => {
    return exams
      .filter((e) => attempts.some((a) => a.examId === e.id))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [exams, attempts]);

  const statusVariant: Record<ExamStatus, any> = {
    draft: "draft",
    published: "published",
    active: "active",
    closed: "closed",
  };

  return (
    <TeacherLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1
          className="text-2xl font-bold text-[#0f172a] mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Results
        </h1>

        {examsWithResults.length === 0 ? (
          <EmptyState
            title="No results yet"
            description="Results will appear here once students complete their exams."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {examsWithResults.map((exam) => {
              const examAttempts = attempts.filter(
                (a) => a.examId === exam.id && a.submitted
              );
              const avgPct =
                examAttempts.length > 0
                  ? Math.round(
                      examAttempts.reduce(
                        (s, a) => s + (a.percentage ?? 0),
                        0
                      ) / examAttempts.length
                    )
                  : null;

              return (
                <div
                  key={exam.id}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-5 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() =>
                    navigate(`/teacher/exams/${exam.id}/results`)
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className="font-semibold text-[#0f172a]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {exam.title}
                        </h3>
                        <Badge variant={statusVariant[exam.status]}>
                          {exam.status.charAt(0).toUpperCase() +
                            exam.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-[#94a3b8] flex-wrap">
                        <span>{examAttempts.length} submissions</span>
                        {avgPct !== null && (
                          <span>Avg: {avgPct}%</span>
                        )}
                        <span>{formatDate(exam.createdAt)}</span>
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-4 h-4 text-[#94a3b8] flex-shrink-0 mt-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L9.19 8 6.22 5.28a.75.75 0 010-1.06z"
                      />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
