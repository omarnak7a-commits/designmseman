import { useEffect } from "react";
import { Router, Routes, Route, useNavigate, usePath, useRouteParams } from "@/lib/router";
import { ToastProvider } from "@/components/ui/Toast";
import { isLoggedIn } from "@/lib/auth";
import { seedIfNeeded } from "@/lib/store";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/teacher/Dashboard";
import Exams from "@/pages/teacher/Exams";
import CreateExam from "@/pages/teacher/CreateExam";
import Results from "@/pages/teacher/Results";
import StudentResultDetail from "@/pages/teacher/StudentResultDetail";
import Students from "@/pages/teacher/Students";
import Settings from "@/pages/teacher/Settings";
import ExamEntry from "@/pages/student/ExamEntry";
import ActiveExam from "@/pages/student/ActiveExam";
import ResultPage from "@/pages/student/ResultPage";
import Leaderboard from "@/pages/student/Leaderboard";
import AnswerReview from "@/pages/student/AnswerReview";
import TeacherResultsRedirect from "@/pages/teacher/TeacherResultsRedirect";

// Seed on mount
seedIfNeeded();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const path = usePath();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", true);
    }
  }, [path]);

  if (!isLoggedIn()) return null;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Teacher routes */}
      <Route
        path="/teacher/dashboard"
        element={<AuthGuard><Dashboard /></AuthGuard>}
      />
      <Route
        path="/teacher/exams"
        element={<AuthGuard><Exams /></AuthGuard>}
      />
      <Route
        path="/teacher/exams/create"
        element={<AuthGuard><CreateExam /></AuthGuard>}
      />
      <Route
        path="/teacher/exams/:id"
        element={<AuthGuard><ExamDetailRedirect /></AuthGuard>}
      />
      <Route
        path="/teacher/exams/:id/edit"
        element={<AuthGuard><CreateExam /></AuthGuard>}
      />
      <Route
        path="/teacher/exams/:id/results"
        element={<AuthGuard><Results /></AuthGuard>}
      />
      <Route
        path="/teacher/results"
        element={<AuthGuard><TeacherResultsRedirect /></AuthGuard>}
      />
      <Route
        path="/teacher/results/:id"
        element={<AuthGuard><StudentResultDetail /></AuthGuard>}
      />
      <Route
        path="/teacher/students"
        element={<AuthGuard><Students /></AuthGuard>}
      />
      <Route
        path="/teacher/settings"
        element={<AuthGuard><Settings /></AuthGuard>}
      />

      {/* Student / public routes */}
      <Route path="/exam" element={<ExamLookup />} />
      <Route path="/exam/:code" element={<ExamEntry />} />
      <Route path="/exam/:code/take/:attemptId" element={<ActiveExam />} />
      <Route path="/exam/:code/result/:attemptId" element={<ResultPage />} />
      <Route path="/exam/:code/leaderboard/:attemptId" element={<Leaderboard />} />
      <Route path="/exam/:code/review/:attemptId" element={<AnswerReview />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function ExamDetailRedirect() {
  const navigate = useNavigate();
  const { id } = useRouteParams<{ id: string }>();
  useEffect(() => {
    if (id) navigate(`/teacher/exams/${id}/results`, true);
  }, [id]);
  return null;
}

function ExamLookup() {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-sm w-full">
        <h2
          className="text-xl font-bold text-[#0f172a] mb-4 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Enter Exam Code
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const code = (e.currentTarget.elements.namedItem("code") as HTMLInputElement).value.trim();
            if (code) navigate(`/exam/${code}`);
          }}
          className="flex gap-2"
        >
          <input
            name="code"
            type="text"
            placeholder="e.g. english-grammar-82K4"
            className="flex-1 px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-[10px] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 text-sm font-semibold bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12 text-center">
      <p className="text-6xl font-black text-[#e2e8f0] mb-4" style={{ fontFamily: "var(--font-display)" }}>
        404
      </p>
      <p className="text-xl font-bold text-[#0f172a] mb-2">Page not found</p>
      <p className="text-sm text-[#64748b] mb-6">The page you are looking for does not exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 text-sm font-medium bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors"
      >
        Go Home
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </Router>
  );
}
