import { useNavigate, useRouteParams } from "@/lib/router";
import { getAttempt, getExam } from "@/lib/store";
import Badge from "@/components/ui/Badge";
import logoSrc from "@/imports/Max_a_____________________.png";
import type { Question } from "@/lib/types";

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

export default function AnswerReview() {
  const navigate = useNavigate();
  const { code, attemptId } = useRouteParams<{ code: string; attemptId: string }>();
  const attempt = getAttempt(attemptId);
  const exam = attempt ? getExam(attempt.examId) : undefined;

  if (!attempt || !exam || !attempt.submitted) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center">
        <p className="text-[#64748b]">Review not available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          <img src={logoSrc} alt="Test Yourself" className="h-8 w-auto object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-[#1d4ed8]" style={{ fontFamily: "var(--font-display)" }}>
              Test Yourself
            </span>
            <span className="text-[10px] text-[#64748b]">Ms Eman Zahy</span>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/exam/${code}/result/${attemptId}`)}
            className="text-sm text-[#64748b] hover:text-[#0f172a] flex items-center gap-1 mb-3 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" />
            </svg>
            Back to Results
          </button>
          <h1
            className="text-2xl font-bold text-[#0f172a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Answer Review
          </h1>
          <p className="text-sm text-[#64748b] mt-1">{exam.title}</p>
        </div>

        {/* Summary bar */}
        <div className="flex gap-4 mb-6">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#16a34a]">
              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
            </svg>
            <span className="text-sm font-semibold text-[#16a34a]">
              {attempt.correctCount ?? 0} Correct
            </span>
          </div>
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl px-4 py-2.5 flex items-center gap-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#dc2626]">
              <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
            </svg>
            <span className="text-sm font-semibold text-[#dc2626]">
              {attempt.incorrectCount ?? 0} Incorrect
            </span>
          </div>
        </div>

        {/* All questions */}
        <div className="flex flex-col gap-4">
          {exam.questions.map((q, i) => {
            const answer = attempt.answers[q.id];
            const isCorrect = answer?.isCorrect;

            return (
              <div
                key={q.id}
                className={[
                  "bg-white border rounded-2xl p-5",
                  isCorrect ? "border-[#bbf7d0]" : "border-[#fecaca]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#64748b]">Q{i + 1}</span>
                    <span className="text-xs bg-[#eff6ff] text-[#2563eb] px-2 py-0.5 rounded-full font-medium">
                      {q.type === "mcq" ? "MCQ" : q.type === "ordering" ? "Ordering" : "Brackets"}
                    </span>
                  </div>
                  <Badge variant={isCorrect ? "correct" : "incorrect"}>
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </Badge>
                </div>

                <p className="text-sm font-medium text-[#0f172a] mb-4">{q.text}</p>

                {/* Student answer */}
                <div className="flex flex-col gap-2">
                  <div className="bg-[#f8fafc] rounded-xl p-3">
                    <p className="text-xs text-[#64748b] mb-1">Your Answer</p>
                    <p
                      className={[
                        "text-sm font-medium",
                        isCorrect ? "text-[#16a34a]" : "text-[#dc2626]",
                      ].join(" ")}
                    >
                      {getStudentAnswerDisplay(q, answer?.value)}
                    </p>
                  </div>

                  {/* Only show correct answer if student was wrong */}
                  {!isCorrect && (
                    <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-3">
                      <p className="text-xs text-[#16a34a] mb-1">Correct Answer</p>
                      <p className="text-sm font-medium text-[#16a34a]">
                        {getCorrectAnswerDisplay(q)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
