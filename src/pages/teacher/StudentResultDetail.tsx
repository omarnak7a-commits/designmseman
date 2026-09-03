import TeacherLayout from "@/components/teacher/Layout";
import { useNavigate, useRouteParams } from "@/lib/router";
import { getAttempt, getExam } from "@/lib/store";
import Badge from "@/components/ui/Badge";
import { formatTime, formatDate } from "@/lib/utils";
import type { Question } from "@/lib/types";

export default function StudentResultDetail() {
  const navigate = useNavigate();
  const { id } = useRouteParams<{ id: string }>();
  const attempt = getAttempt(id);
  const exam = attempt ? getExam(attempt.examId) : undefined;

  if (!attempt || !exam) {
    return (
      <TeacherLayout>
        <div className="p-6">
          <p className="text-[#64748b]">Result not found.</p>
        </div>
      </TeacherLayout>
    );
  }

  function getCorrectAnswerDisplay(q: Question): string {
    if (q.type === "mcq") {
      const opt = q.options?.find((o) => o.id === q.correctOptionId);
      return opt ? `${opt.id.toUpperCase()}. ${opt.text}` : "—";
    }
    if (q.type === "ordering") {
      return (q.correctOrder ?? []).join(" → ");
    }
    return q.correctAnswer ?? "—";
  }

  function getStudentAnswerDisplay(q: Question, value: string | string[] | undefined): string {
    if (!value) return "(no answer)";
    if (q.type === "mcq") {
      const opt = q.options?.find((o) => o.id === value);
      return opt ? `${opt.id.toUpperCase()}. ${opt.text}` : String(value);
    }
    if (q.type === "ordering") {
      return Array.isArray(value) ? value.join(" → ") : String(value);
    }
    return String(value);
  }

  return (
    <TeacherLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
          className="text-sm text-[#64748b] hover:text-[#0f172a] flex items-center gap-1 mb-4 transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" />
          </svg>
          Back to Results
        </button>

        {/* Header card */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1
                className="text-xl font-bold text-[#0f172a] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {attempt.studentName}
              </h1>
              <p className="text-sm text-[#64748b]">{exam.title}</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl font-bold text-[#2563eb]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {attempt.percentage}%
              </p>
              <p className="text-sm text-[#64748b]">
                {attempt.score}/{attempt.maxScore} marks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-[#f1f5f9]">
            <div>
              <p className="text-xs text-[#64748b]">Rank</p>
              <p className="font-semibold text-[#0f172a]">
                {attempt.rank ? `#${attempt.rank}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Time Used</p>
              <p className="font-semibold text-[#0f172a]">
                {attempt.timeUsed ? formatTime(attempt.timeUsed) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Start Time</p>
              <p className="font-semibold text-[#0f172a]">
                {formatDate(attempt.startTime)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Submitted</p>
              <p className="font-semibold text-[#0f172a]">
                {attempt.submittedAt ? formatDate(attempt.submittedAt) : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Correct/Incorrect summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 text-center">
            <p
              className="text-3xl font-bold text-[#16a34a]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {attempt.correctCount ?? 0}
            </p>
            <p className="text-sm text-[#16a34a] font-medium mt-0.5">Correct</p>
          </div>
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-2xl p-4 text-center">
            <p
              className="text-3xl font-bold text-[#dc2626]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {attempt.incorrectCount ?? 0}
            </p>
            <p className="text-sm text-[#dc2626] font-medium mt-0.5">Incorrect</p>
          </div>
        </div>

        {/* Question by question */}
        <h2 className="font-semibold text-[#0f172a] mb-4" style={{ fontFamily: "var(--font-display)" }}>
          All Questions
        </h2>
        <div className="flex flex-col gap-3">
          {exam.questions.map((q, i) => {
            const answer = attempt.answers[q.id];
            const isCorrect = answer?.isCorrect;
            return (
              <div
                key={q.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#64748b]">Q{i + 1}</span>
                    <span className="text-xs bg-[#eff6ff] text-[#2563eb] px-2 py-0.5 rounded-full font-medium">
                      {q.type === "mcq" ? "MCQ" : q.type === "ordering" ? "Ordering" : "Brackets"}
                    </span>
                    <span className="text-xs text-[#94a3b8]">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
                  </div>
                  <Badge variant={isCorrect ? "correct" : "incorrect"}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-[#0f172a] mb-3">{q.text}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-[#f8fafc] rounded-xl p-3">
                    <p className="text-xs text-[#64748b] mb-1">Student Answer</p>
                    <p className="text-sm text-[#0f172a]">
                      {getStudentAnswerDisplay(q, answer?.value)}
                    </p>
                  </div>
                  <div className="bg-[#f0fdf4] rounded-xl p-3">
                    <p className="text-xs text-[#16a34a] mb-1">Correct Answer</p>
                    <p className="text-sm text-[#0f172a]">
                      {getCorrectAnswerDisplay(q)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TeacherLayout>
  );
}
