import { useState, useMemo } from "react";
import TeacherLayout from "@/components/teacher/Layout";
import { useNavigate } from "@/lib/router";
import {
  getExams,
  getAttempts,
  deleteExam,
  publishExam,
  closeExam,
} from "@/lib/store";
import Badge from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatDuration, getExamUrl, copyToClipboard } from "@/lib/utils";
import type { ExamStatus } from "@/lib/types";

const STATUS_TABS: { label: string; value: ExamStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Active", value: "active" },
  { label: "Closed", value: "closed" },
];

export default function Exams() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<ExamStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [, forceRender] = useState(0);

  const exams = getExams();
  const attempts = getAttempts();

  const filtered = useMemo(() => {
    return exams.filter((e) => {
      if (filter !== "all" && e.status !== filter) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [exams, filter, search, /* eslint-disable-line */]);

  function handleDelete(id: string) {
    deleteExam(id);
    toast("Exam deleted.", "info");
    forceRender((n) => n + 1);
  }

  function handlePublish(id: string) {
    const code = publishExam(id);
    toast("Exam published! Link is ready to share.");
    forceRender((n) => n + 1);
    void code;
  }

  function handleClose(id: string) {
    closeExam(id);
    toast("Exam closed.", "info");
    forceRender((n) => n + 1);
  }

  async function handleCopyLink(code: string) {
    await copyToClipboard(getExamUrl(code));
    toast("Exam link copied to clipboard!");
  }

  return (
    <TeacherLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1
            className="text-2xl font-bold text-[#0f172a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Exams
          </h1>
          <button
            onClick={() => navigate("/teacher/exams/create")}
            className="px-4 py-2 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors flex items-center gap-1.5 w-fit"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Create Exam
          </button>
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl flex-wrap">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={[
                  "px-3 py-1.5 text-sm rounded-lg transition-colors font-medium",
                  filter === tab.value
                    ? "bg-white text-[#0f172a] shadow-sm"
                    : "text-[#64748b] hover:text-[#0f172a]",
                ].join(" ")}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl py-16 text-center">
            <p className="text-[#64748b] mb-3">No exams found.</p>
            <button
              onClick={() => navigate("/teacher/exams/create")}
              className="text-sm text-[#2563eb] font-medium hover:underline"
            >
              Create your first exam →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((exam) => {
              const examAttempts = attempts.filter(
                (a) => a.examId === exam.id && a.submitted
              );
              const avgPct =
                examAttempts.length > 0
                  ? Math.round(
                      examAttempts.reduce((s, a) => s + (a.percentage ?? 0), 0) /
                        examAttempts.length
                    )
                  : null;

              return (
                <div
                  key={exam.id}
                  className="bg-white border border-[#e2e8f0] rounded-2xl p-5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className="font-semibold text-[#0f172a] truncate"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {exam.title}
                        </h3>
                        <Badge variant={exam.status as any}>{exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}</Badge>
                      </div>
                      {exam.description && (
                        <p className="text-sm text-[#64748b] line-clamp-1 mb-2">
                          {exam.description}
                        </p>
                      )}
                      <div className="flex gap-4 text-xs text-[#94a3b8] flex-wrap">
                        <span>{exam.questions.length} questions</span>
                        <span>{formatDuration(exam.duration)}</span>
                        <span>{examAttempts.length} attempts</span>
                        {avgPct !== null && <span>Avg: {avgPct}%</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {exam.status === "draft" && (
                        <button
                          onClick={() => handlePublish(exam.id)}
                          className="px-3 py-1.5 text-xs font-medium bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
                        >
                          Publish
                        </button>
                      )}
                      {exam.code && (
                        <button
                          onClick={() => handleCopyLink(exam.code)}
                          className="px-3 py-1.5 text-xs font-medium border border-[#e2e8f0] text-[#64748b] rounded-lg hover:bg-[#f8fafc] transition-colors"
                        >
                          Copy Link
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/teacher/exams/${exam.id}/results`)}
                        className="px-3 py-1.5 text-xs font-medium border border-[#e2e8f0] text-[#64748b] rounded-lg hover:bg-[#f8fafc] transition-colors"
                      >
                        Results
                      </button>
                      <button
                        onClick={() => navigate(`/teacher/exams/${exam.id}/edit`)}
                        className="px-3 py-1.5 text-xs font-medium border border-[#e2e8f0] text-[#64748b] rounded-lg hover:bg-[#f8fafc] transition-colors"
                      >
                        Edit
                      </button>
                      {exam.status !== "closed" && exam.status !== "draft" && (
                        <button
                          onClick={() => handleClose(exam.id)}
                          className="px-3 py-1.5 text-xs font-medium border border-[#e2e8f0] text-[#64748b] rounded-lg hover:bg-[#f8fafc] transition-colors"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => setConfirmDelete(exam.id)}
                        className="px-3 py-1.5 text-xs font-medium border border-[#fecaca] text-[#dc2626] rounded-lg hover:bg-[#fef2f2] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Exam"
        message="Are you sure you want to delete this exam? All student attempts and results will also be deleted. This action cannot be undone."
        confirmLabel="Delete Exam"
        confirmVariant="danger"
      />
    </TeacherLayout>
  );
}
