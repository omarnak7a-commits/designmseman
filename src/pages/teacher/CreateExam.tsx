import { useState, useEffect } from "react";
import TeacherLayout from "@/components/teacher/Layout";
import { useNavigate, useRouteParams } from "@/lib/router";
import { getExam, saveExam, publishExam } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import { generateId, generateCode, getExamUrl, copyToClipboard } from "@/lib/utils";
import type { Exam, Question, McqOption } from "@/lib/types";

const DURATION_OPTIONS = [10, 20, 30, 45, 60];

function defaultExam(): Exam {
  return {
    id: generateId(),
    code: "",
    title: "",
    description: "",
    instructions:
      "Read each question carefully and answer to the best of your ability.",
    duration: 30,
    status: "draft",
    settings: {
      allowRanking: true,
      showRankingToStudents: true,
      showResults: true,
      showAnswerReview: true,
    },
    questions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ── Question Form ────────────────────────────────────────────────────────────

function QuestionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Question;
  onSave: (q: Question) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<Question["type"]>(initial?.type ?? "mcq");
  const [text, setText] = useState(initial?.text ?? "");
  const [marks, setMarks] = useState(initial?.marks ?? 1);
  // MCQ
  const [options, setOptions] = useState<McqOption[]>(
    initial?.options ?? [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ]
  );
  const [correctOptionId, setCorrectOptionId] = useState(
    initial?.correctOptionId ?? "a"
  );
  // Ordering
  const [items, setItems] = useState<string[]>(initial?.items ?? ["", ""]);
  const [correctOrder, setCorrectOrder] = useState<string[]>(
    initial?.correctOrder ?? []
  );
  // Brackets
  const [correctAnswer, setCorrectAnswer] = useState(
    initial?.correctAnswer ?? ""
  );
  const [error, setError] = useState("");

  function handleSubmit() {
    setError("");
    if (!text.trim()) { setError("Question text is required."); return; }
    if (type === "mcq" && options.some((o) => !o.text.trim())) {
      setError("All options must have text."); return;
    }
    if (type === "ordering" && items.filter((i) => i.trim()).length < 2) {
      setError("At least 2 items required."); return;
    }
    if (type === "brackets" && !correctAnswer.trim()) {
      setError("Correct answer is required."); return;
    }

    const cleanItems = items.filter((i) => i.trim());

    const q: Question = {
      id: initial?.id ?? generateId(),
      type,
      text: text.trim(),
      marks,
      ...(type === "mcq" && { options, correctOptionId }),
      ...(type === "ordering" && {
        items: cleanItems,
        correctOrder: correctOrder.length === cleanItems.length ? correctOrder : cleanItems,
      }),
      ...(type === "brackets" && { correctAnswer: correctAnswer.trim() }),
    };
    onSave(q);
  }

  const typeLabels: Record<Question["type"], string> = {
    mcq: "Multiple Choice",
    ordering: "Ordering",
    brackets: "Correct the Brackets",
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Type selector */}
      <div className="flex gap-2">
        {(["mcq", "ordering", "brackets"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={[
              "px-3 py-1.5 text-sm rounded-lg border transition-colors font-medium",
              type === t
                ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb]"
                : "border-[#e2e8f0] text-[#64748b] hover:border-[#2563eb]/40",
            ].join(" ")}
          >
            {typeLabels[t]}
          </button>
        ))}
      </div>

      {/* Question text */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[#0f172a]">
          Question Text
          {type === "brackets" && (
            <span className="text-xs text-[#64748b] ml-1">
              (use parentheses for the word to correct, e.g. She (go) to school.)
            </span>
          )}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="Enter question text..."
          className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] resize-none"
        />
      </div>

      {/* MCQ options */}
      {type === "mcq" && (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-[#0f172a]">Options</label>
          {options.map((opt, i) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={correctOptionId === opt.id}
                onChange={() => setCorrectOptionId(opt.id)}
                className="accent-[#2563eb]"
              />
              <span className="text-sm font-medium text-[#64748b] w-5">
                {opt.id.toUpperCase()}.
              </span>
              <input
                type="text"
                value={opt.text}
                onChange={(e) => {
                  const updated = [...options];
                  updated[i] = { ...opt, text: e.target.value };
                  setOptions(updated);
                }}
                placeholder={`Option ${opt.id.toUpperCase()}`}
                className="flex-1 px-3 py-1.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
              />
            </div>
          ))}
          <p className="text-xs text-[#64748b]">Select the radio button next to the correct answer.</p>
        </div>
      )}

      {/* Ordering items */}
      {type === "ordering" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#0f172a]">Items (correct order top to bottom)</label>
            <button
              type="button"
              onClick={() => setItems([...items, ""])}
              className="text-xs text-[#2563eb] hover:underline"
            >
              + Add item
            </button>
          </div>
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-[#94a3b8] w-5 text-right">{i + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...items];
                  updated[i] = e.target.value;
                  setItems(updated);
                }}
                placeholder={`Item ${i + 1}`}
                className="flex-1 px-3 py-1.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
              />
              {items.length > 2 && (
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                  className="text-[#dc2626] hover:text-[#b91c1c] text-xs"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <p className="text-xs text-[#64748b]">Items are listed in the correct order. Students will receive them shuffled.</p>
        </div>
      )}

      {/* Brackets */}
      {type === "brackets" && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#0f172a]">Correct Answer</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            placeholder="e.g. goes"
            className="px-3 py-1.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
          />
        </div>
      )}

      {/* Marks */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[#0f172a]">Marks</label>
        <input
          type="number"
          min={1}
          max={20}
          value={marks}
          onChange={(e) => setMarks(Number(e.target.value))}
          className="w-24 px-3 py-1.5 text-sm border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
        />
      </div>

      {error && (
        <p className="text-sm text-[#dc2626] bg-[#fef2f2] rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 justify-end border-t border-[#f1f5f9] pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[#64748b] border border-[#e2e8f0] rounded-[10px] hover:bg-[#f8fafc] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
        >
          {initial ? "Save Changes" : "Add Question"}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CreateExam({ editId }: { editId?: string }) {
  const navigate = useNavigate();
  const params = useRouteParams<{ id?: string }>();
  const resolvedId = editId ?? params.id;
  const isEdit = !!resolvedId;

  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [exam, setExam] = useState<Exam>(() => {
    if (resolvedId) {
      return getExam(resolvedId) ?? defaultExam();
    }
    return defaultExam();
  });
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deleteQId, setDeleteQId] = useState<string | null>(null);
  const [customDuration, setCustomDuration] = useState(
    DURATION_OPTIONS.includes(exam.duration) ? "" : String(exam.duration)
  );
  const [publishedCode, setPublishedCode] = useState("");
  const [showPublished, setShowPublished] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (resolvedId) {
      const e = getExam(resolvedId);
      if (e) setExam(e);
    }
  }, [resolvedId]);

  function update(patch: Partial<Exam>) {
    setExam((prev) => ({ ...prev, ...patch, updatedAt: new Date().toISOString() }));
  }

  function saveAndContinue() {
    if (step === 1) {
      if (!exam.title.trim()) { alert("Exam title is required."); return; }
    }
    setStep(step + 1);
  }

  function handleSaveDraft() {
    const e = { ...exam, code: exam.code || generateCode(exam.title) };
    saveExam(e);
    setExam(e);
    toast(isEdit ? "Exam saved." : "Draft saved.");
    if (!isEdit) navigate(`/teacher/exams/${e.id}/edit`);
  }

  function handlePublish() {
    const e = { ...exam };
    if (!e.code) e.code = generateCode(e.title);
    e.status = "published";
    saveExam(e);
    const code = publishExam(e.id);
    setPublishedCode(code);
    setShowPublished(true);
    toast("Exam published successfully!");
  }

  function addQuestion(q: Question) {
    update({ questions: [...exam.questions, q] });
    setAddingQuestion(false);
    toast("Question added.");
  }

  function updateQuestion(q: Question) {
    update({
      questions: exam.questions.map((x) => (x.id === q.id ? q : x)),
    });
    setEditingQuestion(null);
    toast("Question updated.");
  }

  function deleteQuestion(id: string) {
    update({ questions: exam.questions.filter((q) => q.id !== id) });
    toast("Question deleted.", "info");
  }

  function duplicateQuestion(q: Question) {
    const copy = { ...q, id: generateId() };
    const idx = exam.questions.findIndex((x) => x.id === q.id);
    const updated = [...exam.questions];
    updated.splice(idx + 1, 0, copy);
    update({ questions: updated });
    toast("Question duplicated.");
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const updated = [...exam.questions];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(targetIdx, 0, moved);
    update({ questions: updated });
    setDragIdx(null);
    setDragOver(null);
  }

  const totalMarks = exam.questions.reduce((s, q) => s + q.marks, 0);
  const typeLabel: Record<Question["type"], string> = {
    mcq: "MCQ",
    ordering: "Ordering",
    brackets: "Brackets",
  };

  const stepLabels = ["Basic Info", "Settings", "Questions"];

  return (
    <TeacherLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/teacher/exams")}
            className="text-sm text-[#64748b] hover:text-[#0f172a] flex items-center gap-1 mb-4 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" />
            </svg>
            Back to Exams
          </button>
          <h1
            className="text-2xl font-bold text-[#0f172a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {isEdit ? "Edit Exam" : "Create Exam"}
          </h1>
        </div>

        {/* Steps */}
        <div className="flex gap-0 mb-8">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                    step > i + 1
                      ? "bg-[#2563eb] border-[#2563eb] text-white"
                      : step === i + 1
                      ? "border-[#2563eb] text-[#2563eb] bg-white"
                      : "border-[#e2e8f0] text-[#94a3b8] bg-white",
                  ].join(" ")}
                >
                  {step > i + 1 ? (
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={[
                    "text-xs mt-1 hidden sm:block",
                    step === i + 1 ? "text-[#2563eb] font-medium" : "text-[#94a3b8]",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={[
                    "flex-1 h-0.5 mx-2",
                    step > i + 1 ? "bg-[#2563eb]" : "bg-[#e2e8f0]",
                  ].join(" ")}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>
                Basic Information
              </h2>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0f172a]">Exam Title *</label>
                <input
                  type="text"
                  value={exam.title}
                  onChange={(e) => update({ title: e.target.value })}
                  placeholder="e.g. English Grammar Test"
                  className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0f172a]">Description</label>
                <textarea
                  value={exam.description}
                  onChange={(e) => update({ description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of this exam..."
                  className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] resize-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#0f172a]">Instructions</label>
                <textarea
                  value={exam.instructions}
                  onChange={(e) => update({ instructions: e.target.value })}
                  rows={3}
                  placeholder="Instructions shown to students before starting..."
                  className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Settings */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>
                Exam Settings
              </h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0f172a]">Duration</label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { update({ duration: d }); setCustomDuration(""); }}
                      className={[
                        "px-4 py-2 text-sm rounded-[10px] border transition-colors font-medium",
                        exam.duration === d && !customDuration
                          ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb]"
                          : "border-[#e2e8f0] text-[#64748b] hover:border-[#2563eb]/40",
                      ].join(" ")}
                    >
                      {d} min
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={240}
                      value={customDuration}
                      onChange={(e) => {
                        setCustomDuration(e.target.value);
                        if (e.target.value) update({ duration: Number(e.target.value) });
                      }}
                      placeholder="Custom"
                      className={[
                        "w-24 px-3 py-2 text-sm border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]",
                        customDuration ? "border-[#2563eb]" : "border-[#e2e8f0]",
                      ].join(" ")}
                    />
                    {customDuration && <span className="text-sm text-[#64748b]">min</span>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-[#0f172a]">Options</label>
                {[
                  { key: "allowRanking", label: "Allow ranking", desc: "Track and calculate student rankings" },
                  { key: "showRankingToStudents", label: "Show ranking to students", desc: "Students can see the leaderboard after submission" },
                  { key: "showResults", label: "Show results to students", desc: "Students can see their score after submission" },
                  { key: "showAnswerReview", label: "Show answer review", desc: "Students can review all answers after submission" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={exam.settings[opt.key as keyof typeof exam.settings] as boolean}
                      onChange={(e) =>
                        update({
                          settings: {
                            ...exam.settings,
                            [opt.key]: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 accent-[#2563eb]"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#0f172a] group-hover:text-[#2563eb] transition-colors">
                        {opt.label}
                      </p>
                      <p className="text-xs text-[#64748b]">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Questions */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#0f172a]" style={{ fontFamily: "var(--font-display)" }}>
                    Questions
                  </h2>
                  <p className="text-xs text-[#64748b] mt-0.5">
                    {exam.questions.length} question{exam.questions.length !== 1 ? "s" : ""} · {totalMarks} total marks
                  </p>
                </div>
                <button
                  onClick={() => setAddingQuestion(true)}
                  className="px-3 py-1.5 text-sm font-medium bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" />
                  </svg>
                  Add Question
                </button>
              </div>

              {exam.questions.length === 0 ? (
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-2xl py-12 text-center">
                  <p className="text-sm text-[#64748b] mb-3">No questions yet.</p>
                  <button
                    onClick={() => setAddingQuestion(true)}
                    className="text-sm text-[#2563eb] hover:underline font-medium"
                  >
                    Add your first question →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {exam.questions.map((q, i) => (
                    <div
                      key={q.id}
                      draggable
                      onDragStart={() => setDragIdx(i)}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                      onDragEnd={() => { setDragIdx(null); setDragOver(null); }}
                      onDrop={() => handleDrop(i)}
                      className={[
                        "flex items-start gap-3 p-4 border rounded-xl transition-all cursor-grab",
                        dragOver === i
                          ? "border-[#2563eb] bg-[#eff6ff]"
                          : "border-[#e2e8f0] bg-white hover:border-[#2563eb]/30",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#cbd5e1]">
                          <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
                        </svg>
                        <span className="text-sm font-bold text-[#64748b] w-5">{i + 1}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-[#2563eb] bg-[#eff6ff] px-2 py-0.5 rounded-full">
                            {typeLabel[q.type]}
                          </span>
                          <span className="text-xs text-[#94a3b8]">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
                        </div>
                        <p className="text-sm text-[#0f172a] line-clamp-2">{q.text}</p>
                      </div>

                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          onClick={() => setEditingQuestion(q)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
                          title="Edit"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 00-.064.108l-.558 1.953 1.953-.558a.253.253 0 00.108-.064l6.286-6.286zm1.238-3.763a.25.25 0 00-.354 0L10.811 3.65l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => duplicateQuestion(q)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9] transition-colors"
                          title="Duplicate"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteQId(q.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
                          title="Delete"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675l.66 6.6a.25.25 0 00.249.225h5.19a.25.25 0 00.249-.225l.66-6.6a.75.75 0 011.493.149l-.66 6.6A1.748 1.748 0 0110.595 15h-5.19a1.75 1.75 0 01-1.742-1.575l-.66-6.6a.75.75 0 011.493-.15z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 justify-between mt-8 pt-5 border-t border-[#f1f5f9]">
            <div>
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-sm font-medium text-[#64748b] border border-[#e2e8f0] rounded-[10px] hover:bg-[#f8fafc] transition-colors"
                >
                  Back
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 text-sm font-medium text-[#64748b] border border-[#e2e8f0] rounded-[10px] hover:bg-[#f8fafc] transition-colors"
              >
                Save Draft
              </button>
              {step < 3 ? (
                <button
                  onClick={saveAndContinue}
                  className="px-4 py-2 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={exam.questions.length === 0}
                  className="px-4 py-2 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                >
                  Publish Exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit question modal */}
      <Modal
        open={addingQuestion || !!editingQuestion}
        onClose={() => { setAddingQuestion(false); setEditingQuestion(null); }}
        title={editingQuestion ? "Edit Question" : "Add Question"}
        maxWidth="max-w-xl"
      >
        <QuestionForm
          initial={editingQuestion ?? undefined}
          onSave={editingQuestion ? updateQuestion : addQuestion}
          onCancel={() => { setAddingQuestion(false); setEditingQuestion(null); }}
        />
      </Modal>

      {/* Delete question confirm */}
      <ConfirmDialog
        open={!!deleteQId}
        onClose={() => setDeleteQId(null)}
        onConfirm={() => deleteQId && deleteQuestion(deleteQId)}
        title="Delete Question"
        message="Are you sure you want to delete this question?"
        confirmLabel="Delete"
        confirmVariant="danger"
      />

      {/* Published modal */}
      <Modal
        open={showPublished}
        onClose={() => { setShowPublished(false); navigate("/teacher/exams"); }}
        title="Exam Published!"
      >
        <div className="flex flex-col gap-4">
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 text-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-[#16a34a] mx-auto mb-2">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" />
            </svg>
            <p className="font-semibold text-[#16a34a]">Your exam is ready!</p>
          </div>
          <div>
            <p className="text-xs text-[#64748b] mb-1.5">Exam Link</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={publishedCode ? getExamUrl(publishedCode) : ""}
                className="flex-1 px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-[#f8fafc] text-[#0f172a] font-mono text-xs"
              />
              <button
                onClick={() => { copyToClipboard(getExamUrl(publishedCode)); toast("Link copied!"); }}
                className="px-3 py-2 text-sm font-medium bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors flex-shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
          <p className="text-xs text-[#64748b]">
            Share this link with your students via WhatsApp, email, or any messaging platform.
          </p>
          <button
            onClick={() => { setShowPublished(false); navigate("/teacher/exams"); }}
            className="w-full py-2 text-sm font-medium text-[#64748b] border border-[#e2e8f0] rounded-[10px] hover:bg-[#f8fafc] transition-colors"
          >
            Back to Exams
          </button>
        </div>
      </Modal>
    </TeacherLayout>
  );
}
