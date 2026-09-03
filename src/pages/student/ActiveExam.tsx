import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useRouteParams } from "@/lib/router";
import { getAttempt, getExam, saveAnswer, submitAttempt } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import type { Question } from "@/lib/types";
import logoSrc from "@/imports/Max_a_____________________.png";

// Strip correct answer fields before exposing to student
function safeQuestion(q: Question): Question {
  const { correctOptionId: _, correctAnswer: __, correctOrder: ___, ...safe } = q;
  return safe as Question;
}

type FeedbackState = { questionId: string; isCorrect: boolean } | null;

export default function ActiveExam() {
  const navigate = useNavigate();
  const { code, attemptId } = useRouteParams<{ code: string; attemptId: string }>();

  const attempt = getAttempt(attemptId);
  const exam = attempt ? getExam(attempt.examId) : undefined;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    () => {
      const existing: Record<string, string | string[]> = {};
      if (attempt) {
        for (const [k, v] of Object.entries(attempt.answers)) {
          existing[k] = v.value;
        }
      }
      return existing;
    }
  );
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const submitRef = useRef(false);

  // Compute time remaining from deadline
  useEffect(() => {
    if (!attempt) return;
    const deadline = new Date(attempt.deadline).getTime();

    const tick = () => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0 && !submitRef.current) {
        autoSubmit();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [attempt?.deadline]);

  const autoSubmit = useCallback(() => {
    if (submitRef.current) return;
    submitRef.current = true;
    try {
      submitAttempt(attemptId);
    } catch {}
    setSubmitted(true);
    navigate(`/exam/${code}/result/${attemptId}`);
  }, [attemptId, code, navigate]);

  if (!attempt || !exam) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center">
        <p className="text-[#64748b]">Exam not found.</p>
      </div>
    );
  }

  if (attempt.submitted) {
    navigate(`/exam/${code}/result/${attemptId}`);
    return null;
  }

  const questions = exam.questions.map(safeQuestion);
  const currentQ = questions[currentIdx];
  const currentAnswer = answers[currentQ?.id];

  function handleAnswer(value: string | string[]) {
    if (!currentQ) return;

    // Save to store
    saveAnswer(attemptId, currentQ.id, value);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));

    // Check correctness (from original exam question, not stripped)
    const origQ = exam!.questions[currentIdx];
    let isCorrect = false;
    if (origQ.type === "mcq") {
      isCorrect = value === origQ.correctOptionId;
    } else if (origQ.type === "ordering") {
      const arr = value as string[];
      isCorrect =
        arr.length === (origQ.correctOrder?.length ?? 0) &&
        (origQ.correctOrder ?? []).every((v, i) => v === arr[i]);
    } else if (origQ.type === "brackets") {
      isCorrect =
        (value as string).trim().toLowerCase() ===
        (origQ.correctAnswer ?? "").trim().toLowerCase();
    }

    setFeedback({ questionId: currentQ.id, isCorrect });
  }

  function handleNext() {
    setFeedback(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  }

  function handlePrev() {
    setFeedback(null);
    setCurrentIdx(Math.max(0, currentIdx - 1));
  }

  function handleSubmitConfirm() {
    submitRef.current = true;
    const result = submitAttempt(attemptId);
    setSubmitted(true);
    navigate(`/exam/${code}/result/${attemptId}`);
  }

  const isLowTime = timeLeft <= 300 && timeLeft > 0;
  const isCritical = timeLeft <= 60 && timeLeft > 0;

  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img src={logoSrc} alt="" className="h-7 w-auto object-contain" />
            <span className="text-sm font-semibold text-[#0f172a] hidden sm:block truncate max-w-48">
              {exam.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm",
                isCritical
                  ? "bg-[#fef2f2] text-[#dc2626]"
                  : isLowTime
                  ? "bg-[#fffbeb] text-[#d97706]"
                  : "bg-[#eff6ff] text-[#2563eb]",
              ].join(" ")}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5c0 .199.079.39.22.53l2.5 2.5a.75.75 0 001.06-1.06L8.5 7.94V4.75z" />
              </svg>
              {formatTime(timeLeft)}
            </div>

            {/* Mobile navigator toggle */}
            <button
              onClick={() => setShowNavigator(!showNavigator)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b]"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M2 3.75A.75.75 0 012.75 3h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4A.75.75 0 012.75 7h10.5a.75.75 0 010 1.5H2.75A.75.75 0 012 7.75zm0 4a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-5xl mx-auto w-full px-4 py-6 gap-6">
        {/* Main question area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#64748b]">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-[#64748b]">
              {Object.keys(answers).length} answered
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-[#e2e8f0] rounded-full">
            <div
              className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
              style={{
                width: `${(Object.keys(answers).length / questions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question card */}
          {currentQ && (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full">
                  {currentQ.type === "mcq"
                    ? "Multiple Choice"
                    : currentQ.type === "ordering"
                    ? "Ordering"
                    : "Fill in the Blanks"}
                </span>
                <span className="text-xs text-[#94a3b8]">{currentQ.marks} mark{currentQ.marks !== 1 ? "s" : ""}</span>
              </div>

              <p className="text-base font-medium text-[#0f172a] leading-relaxed">
                {currentQ.text}
              </p>

              {/* Answer controls */}
              {currentQ.type === "mcq" && currentQ.options && (
                <div className="flex flex-col gap-2">
                  {currentQ.options.map((opt) => {
                    const selected = currentAnswer === opt.id;
                    const showFeedback =
                      feedback?.questionId === currentQ.id && selected;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswer(opt.id)}
                        className={[
                          "flex items-center gap-3 p-4 rounded-xl border text-left transition-all text-sm",
                          showFeedback && feedback?.isCorrect
                            ? "border-[#16a34a] bg-[#f0fdf4]"
                            : showFeedback && !feedback?.isCorrect
                            ? "border-[#dc2626] bg-[#fef2f2]"
                            : selected
                            ? "border-[#2563eb] bg-[#eff6ff]"
                            : "border-[#e2e8f0] hover:border-[#2563eb]/40 hover:bg-[#f8fafc]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                            showFeedback && feedback?.isCorrect
                              ? "bg-[#16a34a] text-white"
                              : showFeedback && !feedback?.isCorrect
                              ? "bg-[#dc2626] text-white"
                              : selected
                              ? "bg-[#2563eb] text-white"
                              : "bg-[#f1f5f9] text-[#64748b]",
                          ].join(" ")}
                        >
                          {opt.id.toUpperCase()}
                        </span>
                        <span className="text-[#0f172a]">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === "ordering" && currentQ.items && (
                <OrderingQuestion
                  items={currentQ.items}
                  value={
                    Array.isArray(currentAnswer)
                      ? (currentAnswer as string[])
                      : undefined
                  }
                  onChange={handleAnswer}
                />
              )}

              {currentQ.type === "brackets" && (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={
                      typeof currentAnswer === "string" ? currentAnswer : ""
                    }
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAnswer(
                          (e.target as HTMLInputElement).value
                        );
                      }
                    }}
                  />
                  <p className="text-xs text-[#94a3b8]">
                    Type the correct form of the word in brackets.
                  </p>
                </div>
              )}

              {/* Feedback banner */}
              {feedback?.questionId === currentQ.id && (
                <div
                  className={[
                    "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
                    feedback.isCorrect
                      ? "bg-[#f0fdf4] text-[#16a34a]"
                      : "bg-[#fef2f2] text-[#dc2626]",
                  ].join(" ")}
                >
                  {feedback.isCorrect ? (
                    <>
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                      </svg>
                      Correct! Well done.
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                        <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                      </svg>
                      Incorrect. Keep going!
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-sm font-medium border border-[#e2e8f0] rounded-[10px] text-[#64748b] hover:bg-[#f8fafc] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" />
              </svg>
              Previous
            </button>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-2 text-sm font-medium bg-[#0f172a] text-white rounded-[10px] hover:bg-[#1e293b] transition-colors"
            >
              Submit Exam
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx === questions.length - 1}
              className="px-4 py-2 text-sm font-medium border border-[#e2e8f0] rounded-[10px] text-[#64748b] hover:bg-[#f8fafc] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              Next
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L9.19 8 6.22 5.28a.75.75 0 010-1.06z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop question navigator */}
        <aside className="hidden md:flex w-48 flex-col gap-3 flex-shrink-0">
          <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide">
            Questions
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, i) => {
              const answered = !!answers[q.id];
              const isCurrent = i === currentIdx;
              return (
                <button
                  key={q.id}
                  onClick={() => { setFeedback(null); setCurrentIdx(i); }}
                  className={[
                    "w-full aspect-square rounded-lg text-xs font-medium transition-colors",
                    isCurrent
                      ? "bg-[#2563eb] text-white"
                      : answered
                      ? "bg-[#bfe3ff] text-[#1d4ed8]"
                      : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]",
                  ].join(" ")}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <div className="w-3 h-3 rounded bg-[#2563eb]" /> Current
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <div className="w-3 h-3 rounded bg-[#bfe3ff]" /> Answered
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <div className="w-3 h-3 rounded bg-[#f1f5f9]" /> Unanswered
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile navigator drawer */}
      {showNavigator && (
        <div
          className="md:hidden fixed inset-0 z-30"
          style={{ background: "rgba(15,23,42,0.4)" }}
        >
          <div
            className="absolute inset-0"
            onClick={() => setShowNavigator(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5">
            <p className="text-sm font-medium text-[#0f172a] mb-3">Questions</p>
            <div className="grid grid-cols-8 gap-2">
              {questions.map((q, i) => {
                const answered = !!answers[q.id];
                const isCurrent = i === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setFeedback(null);
                      setCurrentIdx(i);
                      setShowNavigator(false);
                    }}
                    className={[
                      "aspect-square rounded-lg text-xs font-medium transition-colors",
                      isCurrent
                        ? "bg-[#2563eb] text-white"
                        : answered
                        ? "bg-[#bfe3ff] text-[#1d4ed8]"
                        : "bg-[#f1f5f9] text-[#64748b]",
                    ].join(" ")}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit confirmation */}
      {showSubmitConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(15,23,42,0.4)" }}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3
              className="text-lg font-bold text-[#0f172a] mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Submit Exam?
            </h3>
            <p className="text-sm text-[#64748b] mb-2">
              Are you sure you want to submit your exam?
            </p>
            <p className="text-sm text-[#64748b] mb-5">
              {Object.keys(answers).length} of {questions.length} questions answered.
              {Object.keys(answers).length < questions.length && (
                <span className="text-[#d97706] font-medium ml-1">
                  {questions.length - Object.keys(answers).length} unanswered questions will be marked incorrect.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 text-sm font-medium border border-[#e2e8f0] rounded-[10px] text-[#64748b] hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowSubmitConfirm(false); handleSubmitConfirm(); }}
                className="flex-1 py-2.5 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Ordering Question Component ───────────────────────────────────────────────

function OrderingQuestion({
  items,
  value,
  onChange,
}: {
  items: string[];
  value?: string[];
  onChange: (v: string[]) => void;
}) {
  const [order, setOrder] = useState<string[]>(
    () => value ?? [...items].sort(() => Math.random() - 0.5)
  );
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const updated = [...order];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setOrder(updated);
    onChange(updated);
    setDragIdx(null);
    setDragOver(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[#64748b]">Drag to arrange in the correct order:</p>
      {order.map((item, i) => (
        <div
          key={item + i}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
          onDragEnd={() => { setDragIdx(null); setDragOver(null); }}
          onDrop={() => handleDrop(i)}
          className={[
            "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab text-sm",
            dragOver === i
              ? "border-[#2563eb] bg-[#eff6ff]"
              : "border-[#e2e8f0] bg-white hover:border-[#2563eb]/30",
          ].join(" ")}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#cbd5e1] flex-shrink-0">
            <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
          </svg>
          <span className="text-xs font-bold text-[#94a3b8] w-4">{i + 1}.</span>
          <span className="text-[#0f172a]">{item}</span>
        </div>
      ))}
    </div>
  );
}
